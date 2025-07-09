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

    async getUserBoard(userId: string) {
        this.logger.log(`Attempting to find board for user ${userId}`);
        const board = await this.prisma.board.findFirst({
            where: {userId},
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
            this.logger.warn(`Board not found for user ${userId}`);
            throw new NotFoundException('Board not found for this user.');
        }
        this.logger.log(`Successfully found board ${board.id} for user ${userId}`);
        return board;
    }

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