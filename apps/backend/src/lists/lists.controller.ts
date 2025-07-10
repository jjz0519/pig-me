import {Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, Req, UseGuards,} from '@nestjs/common';
import {ListsService} from './lists.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {AuthGuard} from '@nestjs/passport';
import {Request} from 'express';
import {PaginationDto} from '../common/dto/pagination.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('lists')
export class ListsController {
    // Initialize Logger
    private readonly logger = new Logger(ListsController.name);

    constructor(private readonly listsService: ListsService) {
    }

    /**
     * GET /lists/:id
     * Gets the details of a single list, including its cards (paginated).
     */
    @Get(':id')
    getListById(
        @Param('id') id: string,
        @Query() paginationDto: PaginationDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to get list ${id} with pagination`);
        return this.listsService.getListById(id, userId, paginationDto);
    }

    /**
     * POST /lists
     * Handles the creation of a new list within a specified board.
     * Logs the request and delegates the creation task to the list service.
     *
     * @param {CreateListDto} createListDto - The data transfer object containing the details of the list to be created, including the target board ID.
     * @param {Request} req - The HTTP request object, including user information to identify the requester.
     * @return {Promise<any>} A promise resolving to the result of the list creation*/
    @Post()
    create(@Body() createListDto: CreateListDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to create list in board ${createListDto.boardId}`);
        return this.listsService.create(userId, createListDto);
    }

    /**
     * PATCH /lists/:id
     * Updates a specific list with the provided data.
     *
     **/
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateListDto: UpdateListDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to update list ${id}`);
        return this.listsService.update(id, userId, updateListDto);
    }

    /**
     * DELETE /lists/:id
     * Deletes a list by its unique identifier.
     *
     * @param {string} id - The unique identifier of the list to delete.
     * @param {Request} req - The HTTP request object containing the user information.
     * @return {Promise<any>} A promise that resolves to the result of the delete operation.
     */
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to delete list ${id}`);
        return this.listsService.remove(id, userId);
    }
}