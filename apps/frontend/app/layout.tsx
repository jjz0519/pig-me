import type {Metadata} from "next";
import "./globals.css";
import {AuthProvider} from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "Pig Me | Personal Life Booster",
    description: "Your personal Life Booster.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            {/* Add the HeroUI stylesheet link here */}
            <link
                href="https://cdn.jsdelivr.net/npm/daisyui@4.17.1/dist/full.min.css"
                rel="stylesheet"
                type="text/css"
            />
        </head>
        <body>
        {/* AuthProvider wraps the entire application to provide auth context */}
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}