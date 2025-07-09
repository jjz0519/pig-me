import {IsInt, IsNotEmpty, IsString} from 'class-validator';

/**
 * Data Transfer Object (DTO) for moving a card within a system.
 * This class is used to encapsulate the data required to move a card to a new list
 * and reposition it within that list in the desired order.
 *
 * The `MoveCardDto` ensures validation of the fields to maintain proper integrity
 * of the data being transferred between different layers of the application.
 *
 * Properties:
 * - `newListId`: A string identifier representing the target list where the card will be moved.
 *                This field is required and must be a non-empty string.
 * - `newOrder`: An integer value specifying the new position of the card within the target list.
 *               This field is required and must not be empty.
 */
export class MoveCardDto {
    @IsString()
    @IsNotEmpty()
    newListId!: string;

    @IsInt()
    @IsNotEmpty()
    newOrder!: number;
}