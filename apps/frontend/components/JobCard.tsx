import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';

interface CardData {
    id: string;
    companyName: string;
    roleName: string;
}

interface JobCardProps {
    card: CardData;
}

const JobCard: React.FC<JobCardProps> = ({card}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: card.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">{card.companyName}</CardTitle>
                    <p className="text-sm text-gray-600">{card.roleName}</p>
                </CardHeader>
            </Card>
        </div>
    );
};

export default JobCard;