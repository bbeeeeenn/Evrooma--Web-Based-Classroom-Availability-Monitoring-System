"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BackButton({
    dest,
    text = "Back",
    referer,
}: Readonly<{ dest?: string; text?: string; referer?: string | null }>) {
    const router = useRouter();
    const [origin, setOrigin] = useState<string | null>(null);

    useEffect(() => {
        const x = () => setOrigin(window.location.origin);
        x();
    }, []);

    if ((referer && origin && referer.includes(origin)) || !dest)
        return (
            <button
                onClick={() => router.back()}
                className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-green-secondary text-text-primary mt-2 mb-7 flex w-fit cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold shadow-md transition-colors hover:text-black focus-visible:text-black active:scale-105"
            >
                <ArrowLeft size={15} />
                Back
            </button>
        );

    return (
        <Link
            href={dest}
            className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-green-secondary text-text-primary mt-2 mb-7 flex w-fit cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold shadow-md transition-colors hover:text-black focus-visible:text-black active:scale-105"
        >
            <ArrowLeft size={15} />
            {text}
        </Link>
    );
}
