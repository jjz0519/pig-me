import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import {Prisma} from '@repo/database';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {
    }

    private saltRounds = 10;
    private readonly logger = new Logger(AuthService.name);

    // User Registration
    async register(data: Prisma.UserCreateInput) {
        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
        this.logger.log(`Attempting to register user with email: ${data.email}`);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });
        this.logger.log(`User ${data.email} registered successfully with ID: ${user.id}`);
        // Don't return the password in the response
        const {password, ...result} = user;
        return result;
    }

    // User Login
    async login(email: string, pass: string) {
        this.logger.log(`Login attempt for email: ${email}`);
        const user = await this.prisma.user.findUnique({where: {email}});
        if (!user) {
            this.logger.warn(`Login failed: No user found for email ${email}`); // Use 'warn' for failed attempts
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            this.logger.warn(`Login failed: Incorrect password ${pass} for user ${email} (ID: ${user.id})`);
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {sub: user.id, email: user.email};
        this.logger.log(`Login successful for user ${email} (ID: ${user.id}). Generating JWT.`);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}