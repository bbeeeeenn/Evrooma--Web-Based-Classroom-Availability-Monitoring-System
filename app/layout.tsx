import type { Metadata } from "next";
import { Inter, Inria_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

export const metadata: Metadata = {
    title: "EVROOMA",
    description:
        "Helps quickly identify available classrooms through a centralized monitoring system designed for CCIS.",
    icons: [
        {
            rel: "icon",
            url: "/favicon_light.svg",
            media: "(prefers-color-scheme: light)",
        },
        {
            rel: "icon",
            url: "/favicon_dark.svg",
            media: "(prefers-color-scheme: dark)",
        },
    ],
    openGraph: {
        title: "EVROOMA - Find Available Classrooms Instantly",
        images: [
            {
                url: "/display.png",
                width: 1200,
                height: 630,
            },
        ],
    },
};

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});
export const inriaSans = Inria_Sans({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-inria-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={clsx(
                    inter.variable,
                    inriaSans.variable,
                    "min-h-svh antialiased select-none",
                )}
            >
                {children}
                <p className="font-inter bg-black-400 border-t py-1 text-center text-xs text-gray-400">
                    © 2026 EVROOMA. All rights reserved.
                </p>
            </body>
        </html>
    );
}
