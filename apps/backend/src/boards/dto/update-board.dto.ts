import {IsOptional, IsString} from 'class-validator';

export class UpdateBoardDto {
    @IsString()
    @IsOptional()
    name?: string;
}