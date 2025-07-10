import React from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import ListColumn from './ListColumn';
import {Board} from '@/services/boardService';

interface KanbanBoardProps {
    board: Board;
    onDragEnd: (event: DragEndEvent) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({board, onDragEnd}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor)
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={board.lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex space-x-4 overflow-x-auto p-4">
                    {board.lists.map((list) => (
                        <ListColumn key={list.id} list={list}/>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default KanbanBoard;