import React from 'react';
import Link from 'next/link';

interface AuthFormProps {
    formType: 'login' | 'register';
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    errorMessage?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({formType, onSubmit, errorMessage}) => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left lg:pl-10">
                    <h1 className="text-5xl font-bold">
                        {formType === 'login' ? 'Welcome Back!' : 'Join Us Now!'}
                    </h1>
                    <p className="py-6">
                        {formType === 'login'
                            ? 'Access your personal job application tracker and stay organized.'
                            : 'Start tracking your job applications with Pig-Me, your personal career assistant.'}
                    </p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={onSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="input input-bordered"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Error Message Display */}
                        {errorMessage && (
                            <div role="alert" className="alert alert-error mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6"
                                     fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">
                                {formType === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            {formType === 'login' ? (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register" className="link link-hover link-primary">
                                        Sign up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <Link href="/login" className="link link-hover link-primary">
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};