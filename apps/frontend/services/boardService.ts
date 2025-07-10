import api from './api';

// We need to define the types for Board, List, and Card based on your Prisma schema.
// For now, we'll use 'any' as a placeholder.
// It's highly recommended to replace these with actual types for type safety.
export interface Card {
    id: string;
    companyName: string;
    roleName: string;
    // ... other card properties
}

export interface List {
    id: string;
    name: string;
    cards: Card[];
    // ... other list properties
}

export interface Board {
    id: string;
    name: string;
    lists: List[];
    // ... other board properties
}


/**
 * Fetches all boards for the current user.
 * This is a lightweight call that doesn't include lists and cards.
 * @returns {Promise<Board[]>} A promise that resolves to an array of boards.
 */
export const getBoards = async (): Promise<Pick<Board, 'id' | 'name'>[]> => {
    try {
        const response = await api.get<Pick<Board, 'id' | 'name'>[]>('/boards');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch boards:', error);
        throw error;
    }
};

/**
 * Fetches a single board by its ID, including its lists and cards.
 * @param {string} boardId - The ID of the board to fetch.
 * @returns {Promise<Board>} A promise that resolves to the full board object.
 */
export const getBoardById = async (boardId: string): Promise<Board> => {
    try {
        const response = await api.get<Board>(`/boards/${boardId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch board with ID ${boardId}:`, error);
        throw error;
    }
};