import {
    Inter,
    Inria_Sans,
    Poppins,
    Roboto,
    Roboto_Mono,
} from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import VineSounds from "../components/VineSounds";
import { connection } from "next/server";
import { Suspense } from "react";
import { Bounce, ToastContainer } from "react-toastify";

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
const roboto = Roboto({
    variable: "--font-roboto",
    weight: "800",
});
const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    weight: "700",
});

async function VineSFX() {
    await connection();
    const date = new Date();
    return date.getMonth() === 3 && date.getDate() === 1 && <VineSounds />;
    // return <VineSounds />;
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="snap-y snap-mandatory scroll-smooth"
            data-scroll-behavior="smooth"
        >
            <body
                className={clsx(
                    inter.variable,
                    inriaSans.variable,
                    poppins.variable,
                    roboto.variable,
                    robotoMono.variable,
                    "antialiased select-none",
                    "text-text-primary bg-green-primary",
                )}
            >
                <Suspense>
                    <VineSFX />
                </Suspense>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                    transition={Bounce}
                    className="font-semibold"
                />
                {children}
            </body>
        </html>
    );
}
