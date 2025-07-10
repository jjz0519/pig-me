import type {Metadata} from "next";
import "./globals.css";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {AuthProvider} from "@/context/AuthContext"; // Import AuthProvider

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});

export const metadata: Metadata = {
    title: "Pig-Me | Job Tracker",
    description: "Your personal job application tracker.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable,
            )}
        >
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}