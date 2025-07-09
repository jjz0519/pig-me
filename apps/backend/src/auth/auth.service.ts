import {ConflictException, Injectable, Logger, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {Prisma, User} from '@repo/database';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {
    }

    private saltRounds = 10;
    private readonly logger = new Logger(AuthService.name);

    /**
     * Registers a new user with the provided data, including creating default resources such as a
     * board and associated lists for the user. The user's password is hashed for security before saving.
     *
     * @param {Prisma.UserCreateInput} data - The user data required for registration, including email and password.
     * @return {Promise<Omit<User, 'password'>>} The newly created user object without the password field.
     * @throws {ConflictException} If the email address provided in the registration data already exists.
     * @throws {Error} If any unexpected errors occur during the registration process.
     */
    async register(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
        this.logger.log(`Attempting to register user with email: ${data.email}`);

        try {
            // Use a transaction to ensure user, board, and lists are created together
            const user = await this.prisma.$transaction(async (tx) => {
                // 1. Create the user
                const newUser = await tx.user.create({
                    data: {
                        email: data.email,
                        password: hashedPassword,
                    },
                });
                this.logger.log(`User ${newUser.email} created with ID: ${newUser.id}`);

                // 2. Create the default board for the new user
                const defaultBoard = await tx.board.create({
                    data: {
                        name: 'Job Application Board',
                        userId: newUser.id,
                    },
                });
                this.logger.log(`Default board ${defaultBoard.id} created for user ${newUser.id}`);

                // 3. Define and create the default lists for the board
                const defaultLists = [
                    {name: '备忘/感兴趣 (Wishlist)', order: 0},
                    {name: '已投递 (Applied)', order: 1},
                    {name: '笔试/作业 (Assessment)', order: 2},
                    {name: '面试 (Interview)', order: 3},
                    {name: 'Offer', order: 4},
                    {name: '已结束 (Closed)', order: 5},
                ];

                await tx.list.createMany({
                    data: defaultLists.map((list) => ({
                        ...list,
                        boardId: defaultBoard.id,
                    })),
                });
                this.logger.log(`Created ${defaultLists.length} default lists for board ${defaultBoard.id}`);

                return newUser;
            });

            const {password, ...result} = user;
            return result;

        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                this.logger.warn(`Registration failed: Email ${data.email} already exists.`);
                throw new ConflictException('Email already exists.');
            }
            this.logger.error(`An unexpected error occurred during registration: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Authenticates a user by verifying email and password, and generates a JWT upon successful login.
     *
     * @param {string} email - The email address of the user attempting to log in.
     * @param {string} pass - The password provided by the user for authentication.
     * @return {Promise<{ access_token: string }>} - A promise that resolves to an object containing the JWT token if login is successful.
     * @throws {UnauthorizedException} - If the email is not found or the password is incorrect.
     */
    async login(email: string, pass: string): Promise<{ access_token: string; }> {
        this.logger.log(`Login attempt for email: ${email}`);
        const user = await this.prisma.user.findUnique({where: {email}});
        if (!user) {
            this.logger.warn(`Login failed: No user found for email ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            this.logger.warn(
                `Login failed: Incorrect password for user ${email} (ID: ${user.id})`,
            );
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {sub: user.id, email: user.email};
        this.logger.log(
            `Login successful for user ${email} (ID: ${user.id}). Generating JWT.`,
        );
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}