import {IsNotEmpty, IsString} from 'class-validator';

/**
 * Data Transfer Object for creating a card.
 *
 * This class is used to encapsulate the necessary properties
 * required to create a new card. It ensures data validation
 * by enforcing the expected types and required fields.
 */
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