import {Body, Controller, Delete, Logger, Param, Patch, Post, Req, UseGuards,} from '@nestjs/common';
import {ListsService} from './lists.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {AuthGuard} from '@nestjs/passport';
import {Request} from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('lists')
export class ListsController {
    // Initialize Logger
    private readonly logger = new Logger(ListsController.name);

    constructor(private readonly listsService: ListsService) {
    }

    @Post()
    create(@Body() createListDto: CreateListDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to create list in board ${createListDto.boardId}`);
        return this.listsService.create(userId, createListDto);
    }

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

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        this.logger.log(`User ${userId} requested to delete list ${id}`);
        return this.listsService.remove(id, userId);
    }
}