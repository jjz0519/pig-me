'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";

interface AuthFormProps {
    formType: 'login' | 'register';
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    errorMessage?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({formType, onSubmit, errorMessage}) => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
            <Card className="w-full max-w-sm">
                <form onSubmit={onSubmit}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {formType === 'login' ? 'Welcome Back!' : 'Create an Account'}
                        </CardTitle>
                        <CardDescription>
                            {formType === 'login'
                                ? 'Enter your credentials to access your board.'
                                : 'Get started tracking your job applications.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" type="password" name="password" required minLength={6}/>
                        </div>
                        {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full">
                            {formType === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            {formType === 'login' ? (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register" className="underline">
                                        Sign up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <Link href="/login" className="underline">
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
};