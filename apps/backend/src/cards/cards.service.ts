import {ForbiddenException, Injectable, Logger,} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateCardDto} from './dto/create-card.dto';
import {MoveCardDto} from './dto/move-card.dto';

@Injectable()
export class CardsService {
    // Initialize Logger
    private readonly logger = new Logger(CardsService.name);

    constructor(private prisma: PrismaService) {
    }

    async create(userId: string, createCardDto: CreateCardDto) {
        const {listId, companyName} = createCardDto;
        this.logger.log(`Attempting to create card "${companyName}" in list ${listId} for user ${userId}`);

        const list = await this.prisma.list.findUnique({
            where: {id: listId},
            include: {board: true},
        });

        if (!list || list.board.userId !== userId) {
            this.logger.warn(`Create failed: User ${userId} does not have access to list ${listId}.`);
            throw new ForbiddenException('You do not have permission to add a card to this list.');
        }

        const maxOrderCard = await this.prisma.card.findFirst({
            where: {listId},
            orderBy: {order: 'desc'},
        });
        const newOrder = maxOrderCard ? maxOrderCard.order + 1 : 0;

        const card = await this.prisma.card.create({
            data: {
                companyName: createCardDto.companyName,
                roleName: createCardDto.roleName,
                order: newOrder,
                list: {
                    connect: {id: listId},
                },
                user: {
                    connect: {id: userId},
                },
            },
        });

        this.logger.log(`Successfully created card ${card.id} in list ${listId}`);
        return card;
    }

    async move(cardId: string, userId: string, moveCardDto: MoveCardDto) {
        const {newListId, newOrder} = moveCardDto; // newOrder is now the target index (e.g., 0, 1, 2...)

        const cardToMove = await this.prisma.card.findUnique({where: {id: cardId}});
        if (!cardToMove || cardToMove.userId !== userId) {
            throw new ForbiddenException('Permission denied.');
        }

        const cardsInNewList = await this.prisma.card.findMany({
            where: {listId: newListId, id: {not: cardId}},
            orderBy: {order: 'asc'},
        });

        let calculatedOrder: number;

        const prevCard = cardsInNewList[newOrder - 1];
        const nextCard = cardsInNewList[newOrder];

        const prevOrder = prevCard ? prevCard.order : null;
        const nextOrder = nextCard ? nextCard.order : null;

        if (prevOrder !== null && nextOrder !== null) {
            calculatedOrder = (prevOrder + nextOrder) / 2;
        } else if (prevOrder !== null) {
            calculatedOrder = prevOrder + 1;
        } else if (nextOrder !== null) {
            calculatedOrder = nextOrder - 1;
        } else {
            calculatedOrder = 1; // Or any initial value
        }

        const updatedCard = await this.prisma.card.update({
            where: {id: cardId},
            data: {
                listId: newListId,
                order: calculatedOrder,
            },
        });

        this.logger.log(`Successfully moved card ${cardId} with new order ${calculatedOrder}`);
        return updatedCard;
    }
}