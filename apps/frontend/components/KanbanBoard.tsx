'use client';

import React from 'react';
import {closestCenter, DndContext, DragEndEvent} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {Card, CardBody, CardHeader} from '@heroui/react';
import {Board, Card as CardType, List} from '@/services/boardService';

interface KanbanBoardProps {
    board: Board;
    onDragEnd: (event: DragEndEvent) => void;
}

const KanbanList: React.FC<{ list: List }> = ({list}) => (
    <div className="w-80 flex-shrink-0 p-2">
        <Card className="bg-gray-100">
            <CardHeader>
                <h2 className="font-bold">{list.name}</h2>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    {list.cards.map((card) => (
                        <KanbanCard key={card.id} card={card}/>
                    ))}
                </div>
            </CardBody>
        </Card>
    </div>
);

const KanbanCard: React.FC<{ card: CardType }> = ({card}) => (
    <Card className="bg-white shadow-sm">
        <CardBody>
            <p className="font-semibold">{card.companyName}</p>
            <p className="text-sm text-gray-600">{card.roleName}</p>
        </CardBody>
    </Card>
);


const KanbanBoard: React.FC<KanbanBoardProps> = ({board, onDragEnd}) => {
    return (
        <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
            <div className="flex p-4 space-x-4">
                <SortableContext items={board.lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
                    {board.lists.map((list) => (
                        <KanbanList key={list.id} list={list}/>
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
};

export default KanbanBoard;