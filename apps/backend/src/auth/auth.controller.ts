import {Body, Controller, HttpCode, HttpStatus, Logger, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    private readonly logger = new Logger(AuthController.name);

    /**
     * POST /auth/register
     * Handles user registration by receiving registration data, validating it, and passing it to the authentication service.
     **/
    @Post('register')
    // NestJS will automatically validate it against the rules we defined
    async register(@Body() registerDto: RegisterDto) {
        this.logger.log(`Received registration request for email: ${registerDto.email}`);
        return this.authService.register(registerDto);
    }

    /**
     * POST /auth/login
     * Handles the user login request.
     *
     * @param {LoginDto} loginDto - An object containing the login details, including email and password.
     * @return {Promise<any>} A promise that resolves with the authentication result or an error if login fails.
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        this.logger.log(`Received login request for email: ${loginDto.email}`);
        return this.authService.login(loginDto.email, loginDto.password);
    }
}