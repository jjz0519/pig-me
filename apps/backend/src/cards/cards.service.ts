import {ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateCardDto} from './dto/create-card.dto';
import {MoveCardDto} from './dto/move-card.dto';

@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) {
    }

    async create(userId: string, createCardDto: CreateCardDto) {
        const {listId, ...cardData} = createCardDto;

        // Verify that the list belongs to the user
        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list || list.board.userId !== userId) {
            throw new ForbiddenException(
                'You do not have permission to add a card to this list.',
            );
        }

        // Get the current max order in the list and add 1
        const maxOrderCard = await this.prisma.card.findFirst({
            where: {listId},
            orderBy: {order: 'desc'},
        });
        const newOrder = maxOrderCard ? maxOrderCard.order + 1 : 0;


        const card = await this.prisma.card.create({
            data: {
                ...cardData,
                order: newOrder,
                list: {
                    connect: {id: listId},
                },
                user: {
                    connect: {id: userId},
                },
            },
        });

        return card;
    }

    async move(cardId: string, userId: string, moveCardDto: MoveCardDto) {
        const {newListId, newOrder} = moveCardDto;

        // 1. Find the card and verify ownership
        const cardToMove = await this.prisma.card.findUnique({
            where: {id: cardId},
        });

        if (!cardToMove) {
            throw new NotFoundException(`Card with ID ${cardId} not found.`);
        }

        if (cardToMove.userId !== userId) {
            throw new ForbiddenException('You do not have permission to move this card.');
        }

        // 2. Verify the target list exists and belongs to the user
        const targetList = await this.prisma.list.findUnique({
            where: {id: newListId},
            include: {board: true},
        });

        if (!targetList || targetList.board.userId !== userId) {
            throw new ForbiddenException('You do not have permission to move a card to this list.');
        }

        const oldListId = cardToMove.listId;

        // 3. Use a transaction to ensure data integrity
        await this.prisma.$transaction(async (tx) => {
            // Decrement order of cards in the old list that were after the moved card
            await tx.card.updateMany({
                where: {
                    listId: oldListId,
                    order: {gt: cardToMove.order},
                },
                data: {
                    order: {
                        decrement: 1,
                    },
                },
            });

            // Increment order of cards in the new list that are at or after the new position
            await tx.card.updateMany({
                where: {
                    listId: newListId,
                    order: {gte: newOrder},
                },
                data: {
                    order: {
                        increment: 1,
                    },
                },
            });


            // 4. Update the card itself
            await tx.card.update({
                where: {id: cardId},
                data: {
                    listId: newListId,
                    order: newOrder,
                },
            });
        });

        return {message: 'Card moved successfully.'};
    }
}