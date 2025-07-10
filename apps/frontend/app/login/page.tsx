'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {AuthForm} from '@/components/AuthForm';
import api from '../../services/api';
import {useAuth} from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const {login} = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await api.post('/auth/login', {email, password});
            if (response.data.access_token) {
                login(response.data.access_token);
                router.push('/board');
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return <AuthForm formType="login" onSubmit={handleLogin} errorMessage={error}/>;
}