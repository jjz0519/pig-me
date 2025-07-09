import {IsNotEmpty, IsString} from 'class-validator';

/**
 * CreateBoardDto is a data transfer object used to represent the information required
 * to create a new board.
 *
 * Properties:
 * - name: A string that represents the name of the board. This property is mandatory
 *   and must not be empty.
 *
 * Validation:
 * - The `name` property is validated to ensure it is a non-empty string.
 */
export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}