'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token in localStorage on initial load
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        router.push('/login');
    };

    const value = {
        isAuthenticated,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};