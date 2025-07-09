import {IsNotEmpty, IsString} from 'class-validator';

/**
 * DTO (Data Transfer Object) for creating a new list.
 * This class contains the properties required to create a list
 * and their associated validation rules.
 *
 * Properties:
 * - name: The name of the list. It must be a non-empty string.
 * - boardId: The identifier of the board to which the list belongs. It must be a non-empty string.
 */
export class CreateListDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    boardId!: string;
}