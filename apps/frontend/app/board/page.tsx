'use client';

import React, {useCallback, useEffect, useState} from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/context/AuthContext';
import {Board, getBoardById, getBoards} from '@/services/boardService';
import KanbanBoard from '@/components/KanbanBoard';
import {DragEndEvent} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';

// A more specific type for the board state to ensure type safety
type BoardWithListsAndCards = Board;

function BoardPage() {
    const {logout} = useAuth();
    const [board, setBoard] = useState<BoardWithListsAndCards | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const boards = await getBoards();
                if (boards && boards.length > 0) {
                    const firstBoardId = boards[0].id;
                    const boardData = await getBoardById(firstBoardId);
                    setBoard(boardData);
                } else {
                    setError("No boards found. Let's create one!");
                }
            } catch (err) {
                setError('Failed to load board data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoardData();
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;

        if (!over) return;

        if (active.id !== over.id) {
            setBoard((prevBoard) => {
                if (!prevBoard) return null;

                const activeListIndex = prevBoard.lists.findIndex(list => list.cards.some(card => card.id === active.id));
                const overListIndex = prevBoard.lists.findIndex(list => list.cards.some(card => card.id === over.id) || list.id === over.id);

                if (activeListIndex === -1 || overListIndex === -1) return prevBoard;

                const newBoard = {...prevBoard};
                const activeList = newBoard.lists[activeListIndex];
                const overList = newBoard.lists[overListIndex];

                const activeCardIndex = activeList.cards.findIndex(card => card.id === active.id);

                // Handle cross-list dragging
                if (activeList.id !== overList.id) {
                    const [movedCard] = activeList.cards.splice(activeCardIndex, 1);

                    const overCardIndex = overList.cards.findIndex(card => card.id === over.id);

                    if (overCardIndex !== -1) {
                        overList.cards.splice(overCardIndex, 0, movedCard);
                    } else {
                        // Dropping into an empty list or at the end
                        overList.cards.push(movedCard);
                    }
                } else { // Handle same-list sorting
                    const overCardIndex = overList.cards.findIndex(card => card.id === over.id);
                    if (activeCardIndex !== overCardIndex) {
                        overList.cards = arrayMove(overList.cards, activeCardIndex, overCardIndex);
                    }
                }

                // Here you would typically call an API to update the backend
                // Example: api.patch(`/cards/${active.id}/move`, { newListId: overList.id, newOrder: overList.cards.findIndex(c => c.id === active.id) });

                return newBoard;
            });
        }
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen font-semibold text-lg">Loading your
            board...</div>;
    }

    if (error) {
        return <div
            className="flex items-center justify-center h-screen text-red-600 bg-red-50 p-8 rounded-lg">{error}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
            <header className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                <h1 className="text-2xl font-bold">{board?.name || 'My Board'}</h1>
                <Button variant="outline" onClick={logout}>
                    Logout
                </Button>
            </header>
            <main className="flex-grow overflow-x-auto">
                {board ? (
                    <KanbanBoard board={board} onDragEnd={handleDragEnd}/>
                ) : (
                    <p className="text-center p-8 text-gray-500">You don't have a board yet. Let's create one!</p>
                )}
            </main>
        </div>
    );
}

export default function ProtectedBoardPage() {
    return (
        <ProtectedRoute>
            <BoardPage/>
        </ProtectedRoute>
    );
}