import {IsInt, IsNotEmpty, IsUUID} from 'class-validator';

export class MoveCardDto {
    @IsUUID()
    @IsNotEmpty()
    newListId!: string;

    @IsInt()
    @IsNotEmpty()
    newOrder!: number;
}