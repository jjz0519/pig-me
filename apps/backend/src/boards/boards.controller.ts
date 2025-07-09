import {Body, Controller, Delete, Get, Logger, Param, Patch, Post, Req, UseGuards,} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {BoardsService} from './boards.service';
import {CreateBoardDto} from './dto/create-board.dto';
import {UpdateBoardDto} from './dto/update-board.dto';
import {Request} from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardsController {
    // Initialize Logger
    private readonly logger = new Logger(BoardsController.name);

    constructor(private readonly boardsService: BoardsService) {
    }

    @Get('my-board')
    getMyBoard(@Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`Received request to get board for user ${userId}`);
        return this.boardsService.getUserBoard(userId);
    }

    @Post()
    createBoard(@Body() createBoardDto: CreateBoardDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`Received request to create board for user ${userId}`);
        return this.boardsService.createBoard(userId, createBoardDto);
    }

    @Patch(':id')
    updateBoard(
        @Param('id') id: string,
        @Body() updateBoardDto: UpdateBoardDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to update board ${id}`);
        return this.boardsService.updateBoard(id, userId, updateBoardDto);
    }

    @Delete(':id')
    deleteBoard(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to delete board ${id}`);
        return this.boardsService.deleteBoard(id, userId);
    }
}