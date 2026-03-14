import { Inter, Inria_Sans, Poppins } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

export async function generateMetadata() {
    return {
        metadataBase: "https://evrooma.vercel.app",
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
}

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});
const inriaSans = Inria_Sans({
    subsets: ["latin"],
    variable: "--font-inria-sans",
    weight: ["300", "400", "700"],
});
const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["300", "400", "900", "600"],
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
                    poppins.variable,
                    "min-h-svh antialiased select-none",
                )}
            >
                {children}
            </body>
        </html>
    );
}
