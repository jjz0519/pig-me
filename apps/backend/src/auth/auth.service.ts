import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {JwtService} from '@nestjs/jwt';
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

    // User Registration
    async register(data: Prisma.UserCreateInput) {

        const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        // Don't return the password in the response
        const {password, ...result} = user;
        return result;
    }

    // User Login
    async login(email: string, pass: string) {
        const user = await this.prisma.user.findUnique({where: {email}});

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {sub: user.id, email: user.email};

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}