import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {PrismaService} from '../prisma/prisma.service';
import {User} from '@repo/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET not found in environment variables.');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret, // Use the explicitly typed variable here
        });
    }

    async validate(payload: { sub: string; email: string }): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({
            where: {id: payload.sub},
        });

        if (!user) {
            throw new UnauthorizedException('User not found.');
        }

        // For security, never return the password hash
        const {password, ...result} = user;
        return result;
    }
}