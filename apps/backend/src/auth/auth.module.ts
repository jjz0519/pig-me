import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {PrismaModule} from '../prisma/prisma.module';
import {ConfigModule, ConfigService} from '@nestjs/config'; // <-- Import ConfigModule and ConfigService

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        // --- This is the new, asynchronous way to register the module ---
        JwtModule.registerAsync({
            imports: [ConfigModule], // Make ConfigModule available
            useFactory: async (configService: ConfigService) => ({
                // Read the secret from the .env file via ConfigService
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '1d'},
            }),
            inject: [ConfigService], // Inject ConfigService into the factory
        }),
        // --- End of new configuration ---
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {
}