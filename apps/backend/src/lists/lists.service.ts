import {ForbiddenException, Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';

@Injectable()
export class ListsService {
    // Initialize Logger
    private readonly logger = new Logger(ListsService.name);

    constructor(private prisma: PrismaService) {
    }

    /**
     * Creates a new list in the specified board for the given user.
     * Validates the user's ownership of the board before creating the list.
     * The order of the list is automatically calculated based on the existing lists in the*/
    async create(userId: string, createListDto: CreateListDto) {
        const {boardId, name} = createListDto;
        this.logger.log(`Attempting to create list "${name}" in board ${boardId} for user ${userId}`);

        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board || board.userId !== userId) {
            this.logger.warn(`Create failed: User ${userId} does not own board ${boardId}.`);
            throw new ForbiddenException('You do not have permission to add a list to this board.');
        }

        const maxOrderList = await this.prisma.list.findFirst({
            where: {boardId},
            orderBy: {order: 'desc'},
        });
        const newOrder = maxOrderList ? maxOrderList.order + 1 : 0;

        const list = await this.prisma.list.create({
            data: {
                name,
                order: newOrder,
                board: {
                    connect: {id: boardId},
                },
            },
        });

        this.logger.log(`Successfully created list ${list.id} in board ${boardId}`);
        return list;
    }

    /**
     * Updates an existing list specified by its ID with the provided data.
     *
     * @param {string} listId - The ID of the list to be updated.
     * @param {string} userId - The ID of the user attempting to update the list.
     * @param {UpdateListDto} updateListDto - An object containing the updated list data.
     * @return {Promise<Object>} A promise that resolves to the updated list object.
     * @throws {NotFoundException} If the list with the specified ID is not found.
     * @throws {ForbiddenException} If the user does not own the list or lacks the required permissions.
     */
    async update(listId: string, userId: string, updateListDto: UpdateListDto) {
        this.logger.log(`Attempting to update list ${listId} by user ${userId}`);
        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list) {
            this.logger.warn(`Update failed: List with ID ${listId} not found.`);
            throw new NotFoundException(`List with ID ${listId} not found.`);
        }

        if (list.board.userId !== userId) {
            this.logger.warn(`Update failed: User ${userId} does not own list ${listId}.`);
            throw new ForbiddenException('You do not have permission to update this list.');
        }

        const updatedList = await this.prisma.list.update({
            where: {id: listId},
            data: updateListDto,
        });
        this.logger.log(`Successfully updated list ${listId}`);
        return updatedList;
    }

    /**
     * Deletes a list from the database if it exists and if the user has the proper permissions.
     *
     * @param {string} listId - The unique identifier of the list to be deleted.
     * @param {string} userId - The unique identifier of the user attempting to delete the list.
     * @return {Promise<object>} A promise that resolves to an object containing a success message if the deletion is successful.
     * @throws {NotFoundException} If the list with the provided ID does not exist.
     * @throws {ForbiddenException} If the user does not have permission to delete the list.
     */
    async remove(listId: string, userId: string) {
        this.logger.log(`Attempting to delete list ${listId} by user ${userId}`);
        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list) {
            this.logger.warn(`Delete failed: List with ID ${listId} not found.`);
            throw new NotFoundException(`List with ID ${listId} not found.`);
        }

        if (list.board.userId !== userId) {
            this.logger.warn(`Delete failed: User ${userId} does not own list ${listId}.`);
            throw new ForbiddenException('You do not have permission to delete this list.');
        }

        await this.prisma.list.delete({
            where: {id: listId},
        });

        this.logger.log(`Successfully deleted list ${listId}`);
        return {message: 'List deleted successfully.'};
    }
}