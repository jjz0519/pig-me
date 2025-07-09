import {Body, Controller, HttpCode, HttpStatus, Logger, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    private readonly logger = new Logger(AuthController.name);

    @Post('register')
    // NestJS will automatically validate it against the rules we defined
    async register(@Body() registerDto: RegisterDto) {
        this.logger.log(`Received registration request for email: ${registerDto.email}`);
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        this.logger.log(`Received login request for email: ${loginDto.email}`);
        return this.authService.login(loginDto.email, loginDto.password);
    }
}