import {ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';

@Injectable()
export class ListsService {
    constructor(private prisma: PrismaService) {
    }

    async create(userId: string, createListDto: CreateListDto) {
        const {boardId, name} = createListDto;

        const board = await this.prisma.board.findUnique({
            where: {id: boardId},
        });

        if (!board || board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to add a list to this board.',
            );
        }

        const maxOrderList = await this.prisma.list.findFirst({
            where: {boardId},
            orderBy: {order: 'desc'},
        });

        const newOrder = maxOrderList ? maxOrderList.order + 1 : 0;

        return this.prisma.list.create({
            data: {
                name,
                order: newOrder,
                board: {
                    connect: {id: boardId},
                },
            },
        });
    }

    async update(listId: string, userId: string, updateListDto: UpdateListDto) {
        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list) {
            throw new NotFoundException(`List with ID ${listId} not found.`);
        }

        if (list.board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to update this list.',
            );
        }

        return this.prisma.list.update({
            where: {id: listId},
            data: updateListDto,
        });
    }

    async remove(listId: string, userId: string) {
        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list) {
            throw new NotFoundException(`List with ID ${listId} not found.`);
        }

        if (list.board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to delete this list.',
            );
        }

        await this.prisma.list.delete({
            where: {id: listId},
        });

        return {message: 'List deleted successfully.'};
    }
}