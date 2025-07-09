import {Body, Controller, Logger, Param, Patch, Post, Req, UseGuards,} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {CardsService} from './cards.service';
import {CreateCardDto} from './dto/create-card.dto';
import {MoveCardDto} from './dto/move-card.dto';
import {Request} from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardsController {
    // Initialize Logger
    private readonly logger = new Logger(CardsController.name);

    constructor(private readonly cardsService: CardsService) {
    }

    /**
     * POST /cards
     * Creates a new card in the specified list.
     * Logs the user action and delegates the creation process to the cards service.
     *
     * @param {CreateCardDto} createCardDto - The data transfer object containing card details and the target list ID.
     * @param {Request} req - The HTTP request object, which includes the user information.
     * @return {Promise<any>} Returns a promise that resolves to the created card data.
     */
    @Post()
    create(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to create card in list ${createCardDto.listId}`);
        return this.cardsService.create(userId, createCardDto);
    }

    /**
     * PATCH /cards/:id/move
     * Handles the move of a card to a new list.
     * Logs the action and delegates the operation to the cards service.
     *
     * @param {string} id - The unique identifier of the card to be moved.
     * @param {MoveCardDto} moveCardDto - The data transfer object containing the new list ID and other move details.
     * @param {Request} req - The HTTP request object containing user details.
     * @return {Promise<any>} - Returns a promise of the move operation result handled by the cards service.
     */
    @Patch(':id/move')
    move(
        @Param('id') id: string,
        @Body() moveCardDto: MoveCardDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to move card ${id} to list ${moveCardDto.newListId}`);
        return this.cardsService.move(id, userId, moveCardDto);
    }
}