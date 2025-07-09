import {IsInt, IsOptional, IsString} from 'class-validator';

/**
 * UpdateListDto is a data transfer object used to encapsulate
 * the data necessary for updating an existing list. It contains
 * optional properties that allow updating specific fields without
 * requiring all the properties to be provided.
 *
 * Properties:
 * - `name` (optional): A string representing the name of the list to be updated.
 * - `order` (optional): An integer representing the new order or position of the list.
 *
 * Validation Rules:
 * - `name`: Must be a string if provided.
 * - `order`: Must be an integer if provided.
 *
 * This class is typically used in APIs or services that handle updating list-related data,
 * ensuring that only the specified fields get updated when modifying a list object.
 */
export class UpdateListDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    order?: number;
}