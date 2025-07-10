'use client';

import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import {ReactNode, useEffect} from 'react';

const ProtectedRoute = ({children}: { children: ReactNode }) => {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If loading is finished and user is not authenticated, redirect to login
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // If loading, show a simple loading message or a spinner
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If authenticated, render the children components (the actual page)
    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;