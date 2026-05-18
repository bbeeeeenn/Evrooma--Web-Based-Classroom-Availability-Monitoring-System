import {
    Inter,
    Inria_Sans,
    Poppins,
    Roboto,
    Roboto_Mono,
    DM_Sans,
} from "next/font/google";
import type { Metadata } from "next";
import clsx from "clsx";

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
const dmSans = DM_Sans({
    variable: "--font-dm-sans",
});

export const metadata: Metadata = {
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="scrollbar-track-green-quarternary sm:scrollbar-thumb-yellow-primary/75 scrollbar-thumb-green-secondary scrollbar-thin scroll-smooth"
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <body
                className={clsx(
                    inter.variable,
                    inriaSans.variable,
                    poppins.variable,
                    roboto.variable,
                    robotoMono.variable,
                    dmSans.variable,
                    "text-text-primary bg-green-primary antialiased select-none sm:overflow-auto",
                )}
            >
                {children}
            </body>
        </html>
    );
}
