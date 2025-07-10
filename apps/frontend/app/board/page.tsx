'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/AuthContext";

function Board() {
    const {logout} = useAuth();

    return (
        <div className="p-4 md:p-8">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Board</h1>
                <Button variant="outline" onClick={logout}>Logout</Button>
            </header>
            <main>
                <p>Welcome to your job application board!</p>
                {/* The actual Kanban board will be rendered here */}
            </main>
        </div>
    );
}

// Wrap the Board component with ProtectedRoute
export default function BoardPage() {
    return (
        <ProtectedRoute>
            <Board/>
        </ProtectedRoute>
    )
}