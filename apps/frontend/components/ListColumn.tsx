import React from 'react';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import JobCard from './JobCard';
import {List} from '@/services/boardService'; // Assuming types are defined here
import {CSS} from '@dnd-kit/utilities';

interface ListColumnProps {
    list: List;
}

const ListColumn: React.FC<ListColumnProps> = ({list}) => {
    const {
        setNodeRef,
        transform,
        transition
    } = useSortable({id: list.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-80 flex-shrink-0">
            <h2 className="text-lg font-bold mb-4 px-2 tracking-tight">{list.name}</h2>
            <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="min-h-[500px]">
                    {list.cards.map((card) => (
                        <JobCard key={card.id} card={card}/>
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default ListColumn;