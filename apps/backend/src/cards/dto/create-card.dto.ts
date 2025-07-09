import {IsNotEmpty, IsString} from 'class-validator';

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    companyName!: string;

    @IsString()
    @IsNotEmpty()
    roleName!: string;

    @IsString()
    @IsNotEmpty()
    listId!: string;
}