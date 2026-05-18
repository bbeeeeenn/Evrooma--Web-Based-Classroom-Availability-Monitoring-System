import "./globals.css";
import VineSounds from "../components/VineSounds";
import { connection } from "next/server";
import { Suspense } from "react";
import { Bounce, ToastContainer } from "react-toastify";

async function VineSFX() {
    await connection();
    const date = new Date();
    return date.getMonth() === 3 && date.getDate() === 1 && <VineSounds />;
    // return <VineSounds />;
}

export default async function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
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
        </>
    );
}
