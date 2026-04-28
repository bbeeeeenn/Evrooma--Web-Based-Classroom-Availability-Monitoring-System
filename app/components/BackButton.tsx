"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BackButton({
    dest,
    text,
}: Readonly<{ dest?: string; text?: string }>) {
    const router = useRouter();
    const t = text ? text : "Back";
    return (
        <>
            {dest ? (
                <Link
                    href={dest}
                    className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-yellow-primary mt-2 mb-7 flex w-fit cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold shadow-md transition-colors active:scale-105"
                >
                    <ArrowLeft size={15} /> {t}
                </Link>
            ) : (
                <button
                    onClick={() => router.back()}
                    className="hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary bg-yellow-primary mt-2 mb-7 flex w-fit cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm font-semibold shadow-md transition-colors active:scale-105"
                >
                    <ArrowLeft size={15} /> {t}
                </button>
            )}
        </>
    );
}
