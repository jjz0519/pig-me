import {IsOptional, IsString} from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a board's properties.
 * This class is used to validate and enforce the structure
 * of the payload when updating a board.
 *
 * Properties:
 * - name: An optional string representing the new name of the board.
 *
 * Applied Decorators:
 * - @IsString(): Ensures the value is a string.
 * - @IsOptional(): Indicates that the field is optional.
 *
 * The class relies on decorators for validation and metadata.
 */
export class UpdateBoardDto {
    @IsString()
    @IsOptional()
    name?: string;
}