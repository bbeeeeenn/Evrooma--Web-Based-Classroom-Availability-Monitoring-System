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
        metadataBase:
            process.env.NODE_ENV === "development"
                ? new URL("http://localhost:3000")
                : new URL("https://www.evrooma.online"),

        title: "EVROOMA",
        description:
            "Helps quickly identify available classrooms through a centralized monitoring system designed for CCIS.",

        keywords: [
            "EVROOMA",
            "classrooms",
            "CCIS",
            "availability",
            "scheduler",
            "CSU",
            "Caraga State University",
            "Philippines",
            "Ben Jay Lozada",
            "Klein Timothy Magallano",
            "Guy Miras",
            "Carl Joshua Cariño",
        ],

        icons: {
            icon: [
                {
                    url: "/favicon_light.svg",
                    media: "(prefers-color-scheme: light)",
                },
                {
                    url: "/favicon_dark.svg",
                    media: "(prefers-color-scheme: dark)",
                },
            ],
        },

        openGraph: {
            title: "EVROOMA - Find Available Classrooms Instantly",
            description:
                "Helps quickly identify available classrooms through a centralized monitoring system designed for CCIS.",
            url: "https://www.evrooma.online",
            siteName: "EVROOMA",
            images: [
                {
                    url: "/display.png",
                    width: 1200,
                    height: 630,
                    alt: "EVROOMA Preview",
                },
            ],
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title: "EVROOMA - Find Available Classrooms Instantly",
            description:
                "Helps quickly identify available classrooms through a centralized monitoring system designed for CCIS.",
            images: ["/display.png"],
        },

        robots: {
            index: true,
            follow: true,
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
            className="scrollbar-track-green-quarternary scrollbar-thumb-yellow-primary/75 scrollbar-thin scroll-smooth"
            data-scroll-behavior="smooth"
        >
            <body
                className={clsx(
                    inter.variable,
                    inriaSans.variable,
                    poppins.variable,
                    roboto.variable,
                    robotoMono.variable,
                    "antialiased select-none sm:overflow-auto",
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
