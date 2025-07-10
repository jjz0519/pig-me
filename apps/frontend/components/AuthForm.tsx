import React from 'react';
import Link from 'next/link';
import {Button, Card, CardBody, CardHeader, Input} from "@heroui/react";

interface AuthFormProps {
    formType: 'login' | 'register';
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    errorMessage?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({formType, onSubmit, errorMessage}) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl">
                    <CardHeader className="text-center p-6">
                        <h1 className="text-3xl font-bold">
                            {formType === 'login' ? 'Welcome Back!' : 'Join Us Now!'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            {formType === 'login'
                                ? 'Access your personal job application tracker and stay organized.'
                                : 'Start tracking your job applications with Pig-Me, your personal career assistant.'}
                        </p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                label="Email"
                                placeholder="m@example.com"
                                required
                            />
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                label="Password"
                                placeholder="******"
                                required
                                minLength={6}
                            />

                            {errorMessage && (
                                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            <Button type="submit" color="primary" className="w-full">
                                {formType === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>

                            <div className="mt-4 text-center text-sm">
                                {formType === 'login' ? (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <Link href="/register" className="text-primary hover:underline">
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-primary hover:underline">
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};