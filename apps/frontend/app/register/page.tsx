'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {AuthForm} from '@/components/AuthForm';
import api from '../../services/api';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await api.post('/auth/register', {email, password});
            // After successful registration, redirect to login
            router.push('/login');
        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return <AuthForm formType="register" onSubmit={handleRegister} errorMessage={error}/>;
}