'use client';

import React, {useCallback, useEffect, useState} from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {useAuth} from '@/context/AuthContext';
import {Board, getBoardById, getBoards} from '@/services/boardService';
import KanbanBoard from '@/components/KanbanBoard';
import {DragEndEvent} from '@dnd-kit/core';
import {Button} from "@heroui/react";

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
                const firstBoard = boards?.[0];

                // If a first board exists, fetch its detailed data
                if (firstBoard) {
                    const boardData = await getBoardById(firstBoard.id);
                    setBoard(boardData);
                } else {
                    // Handle case where user has no boards
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

        if (!over || active.id === over.id) {
            return;
        }

        setBoard((prevBoard) => {
            if (!prevBoard) return null;

            const activeListIndex = prevBoard.lists.findIndex((list) =>
                list.cards.some((card) => card.id === active.id)
            );
            const overListIndex = prevBoard.lists.findIndex(
                (list) => list.id === over.id || list.cards.some((card) => card.id === over.id)
            );

            if (activeListIndex === -1 || overListIndex === -1) {
                return prevBoard;
            }

            const activeList = prevBoard.lists[activeListIndex];
            const overList = prevBoard.lists[overListIndex];

            if (!activeList || !overList) {
                return prevBoard;
            }

            const newBoard = JSON.parse(JSON.stringify(prevBoard));
            const sourceList = newBoard.lists[activeListIndex];
            const destinationList = newBoard.lists[overListIndex];
            const activeCardIndex = sourceList.cards.findIndex((card: { id: string; }) => card.id === active.id);

            if (activeCardIndex === -1) {
                return prevBoard;
            }

            const [movedCard] = sourceList.cards.splice(activeCardIndex, 1);

            if (sourceList.id === destinationList.id) {
                // Same list sorting
                const overCardIndex = destinationList.cards.findIndex((card: { id: string; }) => card.id === over.id);
                if (overCardIndex !== -1) {
                    destinationList.cards.splice(overCardIndex, 0, movedCard);
                }
            } else {
                // Cross-list moving
                const overCardIndex = destinationList.cards.findIndex((card: { id: string; }) => card.id === over.id);
                if (overCardIndex !== -1) {
                    destinationList.cards.splice(overCardIndex, 0, movedCard);
                } else {
                    destinationList.cards.push(movedCard);
                }
            }

            console.log(`Card ${active.id} moved to List ${destinationList.id}`);

            return newBoard;
        });
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
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="flex justify-between items-center p-4 border-b">
                <h1 className="text-2xl font-bold">{board?.name || 'My Board'}</h1>
                <Button color="primary" onPress={logout}>Logout</Button>
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