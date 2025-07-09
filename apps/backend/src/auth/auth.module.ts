import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import * as Process from "node:process";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: Process.env.JWT_SECRET,
            signOptions: {expiresIn: '1d'}, // <-- Token expires in 1 day
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {
}