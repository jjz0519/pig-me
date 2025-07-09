import {IsInt, IsOptional, IsString} from 'class-validator';

export class UpdateListDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    order?: number;
}