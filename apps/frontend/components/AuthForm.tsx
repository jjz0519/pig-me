'use client';

import React from 'react';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {PigLogo} from './PigLogo';

interface AuthFormProps {
    formType: 'login' | 'register';
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    errorMessage?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({formType, onSubmit, errorMessage}) => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Card className="w-full max-w-sm border-t-4 border-t-pink-400 rounded-xl shadow-lg">
                    <form onSubmit={onSubmit}>
                        <CardHeader className="items-center text-center">
                            <PigLogo/>
                            <CardTitle className="text-2xl font-bold tracking-tight">
                                {formType === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                            </CardTitle>
                            <CardDescription>
                                {formType === 'login'
                                    ? 'Sign in to continue to your board.'
                                    : 'Get started with your personal job tracker.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="font-medium text-sm">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="password" className="font-medium text-sm">Password</label>
                                <Input id="password" type="password" name="password" required minLength={6}/>
                            </div>
                            {errorMessage &&
                                <p className="text-sm font-medium text-red-500 dark:text-red-400">{errorMessage}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button type="submit"
                                    className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white">
                                {formType === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                            <div className="mt-4 text-center text-sm">
                                {formType === 'login' ? (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <Link href="/register" className="underline text-pink-500 hover:text-pink-600">
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <Link href="/login" className="underline text-pink-500 hover:text-pink-600">
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </main>
    );
};