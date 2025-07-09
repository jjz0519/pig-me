import {IsInt, IsNotEmpty, IsString} from 'class-validator';

export class MoveCardDto {
    @IsString()
    @IsNotEmpty()
    newListId!: string;

    @IsInt()
    @IsNotEmpty()
    newOrder!: number;
}