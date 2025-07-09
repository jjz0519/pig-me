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