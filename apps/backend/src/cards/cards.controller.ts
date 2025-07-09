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

    @Post()
    create(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to create card in list ${createCardDto.listId}`);
        return this.cardsService.create(userId, createCardDto);
    }

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