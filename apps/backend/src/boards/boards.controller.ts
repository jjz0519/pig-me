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

    /**
     * GET /boards
     * Gets a list of all boards owned by the user.
     */
    @Get()
    getBoards(@Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`Received request to get all boards for user ${userId}`);
        return this.boardsService.getBoards(userId);
    }

    /**
     * GET /boards/:id
     * Gets the full details of a single board by its ID.
     */
    @Get(':id')
    getBoardById(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`Received request to get board ${id} for user ${userId}`);
        return this.boardsService.getBoardById(id, userId);
    }

    /**
     * POST /boards
     * Handles the creation of a new board for a user.
     * @param {CreateBoardDto} createBoardDto - Data transfer object containing details of the board to be created.
     * @param {Request} req - The HTTP request object containing the user information.
     * @return {Promise<any>} A promise that resolves to the newly created board object.
     */
    @Post()
    createBoard(@Body() createBoardDto: CreateBoardDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`Received request to create board for user ${userId}`);
        return this.boardsService.createBoard(userId, createBoardDto);
    }

    /**
     * PATCH /boards/:id
     * Updates the details of an existing board identified by its ID.
     *
     * @param {string} id - The unique identifier of the board to update.
     * @param {UpdateBoardDto} updateBoardDto - The data transfer object containing updated board information.
     * @param {Request} req - The HTTP request object, which includes user information.
     * @return {Promise<any>} A promise that resolves to the result of the updated board operation.
     */
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

    /**
     * DELETE /boards/:id
     * Handles the deletion of a board identified by its ID.
     *
     * @param {string} id - The ID of the board to be deleted.
     * @param {Request} req - The request object containing user information.
     * @return {Promise<void>} A promise that resolves when the board is successfully deleted.
     */
    @Delete(':id')
    deleteBoard(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to delete board ${id}`);
        return this.boardsService.deleteBoard(id, userId);
    }
}