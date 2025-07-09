import {IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    companyName!: string;

    @IsString()
    @IsNotEmpty()
    roleName!: string;

    @IsUUID()
    @IsNotEmpty()
    listId!: string;
}