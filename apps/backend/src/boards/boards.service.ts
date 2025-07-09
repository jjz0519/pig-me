import {ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateBoardDto} from './dto/create-board.dto';
import {UpdateBoardDto} from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {
    }

    async getUserBoard(userId: string) {
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
            throw new NotFoundException('Board not found for this user.');
        }

        return board;
    }

    async createBoard(userId: string, createBoardDto: CreateBoardDto) {
        return this.prisma.board.create({
            data: {
                ...createBoardDto,
                user: {
                    connect: {id: userId},
                },
            },
        });
    }

    async updateBoard(
        boardId: string,
        userId: string,
        updateBoardDto: UpdateBoardDto,
    ) {
        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board) {
            throw new NotFoundException(`Board with ID ${boardId} not found.`);
        }

        if (board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to update this board.',
            );
        }

        return this.prisma.board.update({
            where: {id: boardId},
            data: updateBoardDto,
        });
    }

    async deleteBoard(boardId: string, userId: string) {
        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board) {
            throw new NotFoundException(`Board with ID ${boardId} not found.`);
        }

        if (board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to delete this board.',
            );
        }

        await this.prisma.board.delete({where: {id: boardId}});
        return {message: 'Board deleted successfully.'};
    }
}