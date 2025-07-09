import {Body, Controller, Param, Patch, Post, Req, UseGuards,} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {CardsService} from './cards.service';
import {CreateCardDto} from './dto/create-card.dto';
import {MoveCardDto} from './dto/move-card.dto';
import {Request} from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {
    }

    @Post()
    create(@Body() createCardDto: CreateCardDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        // Add userId to the DTO before passing it to the service
        return this.cardsService.create(userId, createCardDto);
    }

    @Patch(':id/move')
    move(
        @Param('id') id: string,
        @Body() moveCardDto: MoveCardDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        return this.cardsService.move(id, userId, moveCardDto);
    }
}