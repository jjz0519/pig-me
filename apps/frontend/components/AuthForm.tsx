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
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <form onSubmit={onSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">{formType === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
                        <CardDescription>
                            {formType === 'login'
                                ? 'Enter your email below to login to your account.'
                                : 'Enter your information to create an account.'}
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
                        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full">
                            {formType === 'login' ? 'Sign in' : 'Create account'}
                        </Button>
                        {formType === 'login' && (
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="underline">
                                    Sign up
                                </Link>
                            </div>
                        )}
                        {formType === 'register' && (
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline">
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};