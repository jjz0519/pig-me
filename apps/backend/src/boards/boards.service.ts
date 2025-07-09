import {ForbiddenException, Injectable, Logger, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateBoardDto} from './dto/create-board.dto';
import {UpdateBoardDto} from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    // Initialize Logger
    private readonly logger = new Logger(BoardsService.name);

    constructor(private prisma: PrismaService) {
    }

    /**
     * Get all boards for a user (lightweight).
     * @param userId The ID of the user.
     * @returns A list of boards without lists and cards.
     */
    async getBoards(userId: string) {
        this.logger.log(`Attempting to find all boards for user ${userId}`);
        const boards = await this.prisma.board.findMany({
            where: {userId},
            orderBy: {createdAt: 'asc'},
        });
        this.logger.log(`Found ${boards.length} boards for user ${userId}`);
        return boards;
    }

    /**
     * Get a single board by its ID, including all its lists and cards.
     * @param boardId The ID of the board to retrieve.
     * @param userId The ID of the user requesting the board, for permission check.
     * @returns The full board object with nested lists and cards.
     */
    async getBoardById(boardId: string, userId: string) {
        this.logger.log(`Attempting to find detailed board ${boardId} for user ${userId}`);
        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
            include: {
                lists: {
                    orderBy: {order: 'asc'},
                    include: {
                        cards: {
                            orderBy: {order: 'asc'},
                        },
                    },
                },
            },
        });

        if (!board) {
            this.logger.warn(`Board with ID ${boardId} not found.`);
            throw new NotFoundException(`Board with ID ${boardId} not found.`);
        }

        if (board.userId !== userId) {
            this.logger.warn(`User ${userId} does not have permission to access board ${boardId}.`);
            throw new ForbiddenException('You do not have permission to access this board.');
        }

        this.logger.log(`Successfully found board ${board.id} for user ${userId}`);
        return board;
    }

    /**
     * Creates a new board for the specified user.
     *
     * @param {string} userId - The ID of the user for whom the board is being created.
     * @param {CreateBoardDto} createBoardDto - The data transfer object containing details of the board to be created.
     * @return {Promise<Board>} The newly created board.
     */
    async createBoard(userId: string, createBoardDto: CreateBoardDto) {
        this.logger.log(`Creating new board with name "${createBoardDto.name}" for user ${userId}`);
        const board = await this.prisma.board.create({
            data: {
                ...createBoardDto,
                user: {
                    connect: {id: userId},
                },
            },
        });
        this.logger.log(`Successfully created board ${board.id} for user ${userId}`);
        return board;
    }

    /**
     * Updates the specified board with new data provided by the user.
     *
     * @param {string} boardId - The unique identifier of the board to update.
     * @param {string} userId - The unique identifier of the user attempting to update the board.
     * @param {UpdateBoardDto} updateBoardDto - The data transfer object containing the updated board details.
     * @return {Promise<object>} A promise resolving to the updated board object.
     * @throws {NotFoundException} If the board with the specified ID does not exist.
     * @throws {ForbiddenException} If the user does not have permission to update the board.
     */
    async updateBoard(
        boardId: string,
        userId: string,
        updateBoardDto: UpdateBoardDto,
    ) {
        this.logger.log(`Attempting to update board ${boardId} for user ${userId}`);
        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board) {
            this.logger.warn(`Update failed: Board with ID ${boardId} not found.`);
            throw new NotFoundException(`Board with ID ${boardId} not found.`);
        }

        if (board.userId !== userId) {
            this.logger.warn(`Update failed: User ${userId} does not own board ${boardId}.`);
            throw new ForbiddenException('You do not have permission to update this board.');
        }

        const updatedBoard = await this.prisma.board.update({
            where: {id: boardId},
            data: updateBoardDto,
        });
        this.logger.log(`Successfully updated board ${boardId}`);
        return updatedBoard;
    }

    /**
     * Deletes a board based on the provided board ID and user ID.
     * Ensures the board exists and the requesting user has permissions.
     *
     * @param {string} boardId - The unique identifier of the board to be deleted.
     * @param {string} userId - The unique identifier of the user attempting the deletion.
     * @return {Promise<Object>} A promise resolving to an object containing a success message after the board is deleted.
     * @throws {NotFoundException} If the board with the specified ID does not exist.
     * @throws {ForbiddenException} If the user does not own the board or lacks the necessary permissions.
     */
    async deleteBoard(boardId: string, userId: string) {
        this.logger.log(`Attempting to delete board ${boardId} for user ${userId}`);
        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board) {
            this.logger.warn(`Delete failed: Board with ID ${boardId} not found.`);
            throw new NotFoundException(`Board with ID ${boardId} not found.`);
        }

        if (board.userId !== userId) {
            this.logger.warn(`Delete failed: User ${userId} does not own board ${boardId}.`);
            throw new ForbiddenException(
                'You do not have permission to delete this board.',
            );
        }

        await this.prisma.board.delete({where: {id: boardId}});
        this.logger.log(`Successfully deleted board ${boardId}`);
        return {message: 'Board deleted successfully.'};
    }
}