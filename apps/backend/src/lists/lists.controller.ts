import {Body, Controller, Delete, Param, Patch, Post, Req, UseGuards,} from '@nestjs/common';
import {ListsService} from './lists.service';
import {CreateListDto} from './dto/create-list.dto';
import {UpdateListDto} from './dto/update-list.dto';
import {AuthGuard} from '@nestjs/passport';
import {Request} from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) {
    }

    @Post()
    create(@Body() createListDto: CreateListDto, @Req() req: Request) {
        const userId = (req.user as any).id;
        return this.listsService.create(userId, createListDto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateListDto: UpdateListDto,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;
        return this.listsService.update(id, userId, updateListDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        const userId = (req.user as any).id;
        return this.listsService.remove(id, userId);
    }
}