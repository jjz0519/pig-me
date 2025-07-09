import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class RegisterDto {
    @IsEmail({}, {message: 'Please provide a valid email address.'})
    @IsNotEmpty({message: 'Email should not be empty.'})
    email!: string;

    @IsNotEmpty()
    @MinLength(6, {message: 'Password must be at least 6 characters long.'})
    password!: string;
}