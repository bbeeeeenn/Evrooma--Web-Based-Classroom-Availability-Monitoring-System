"use client";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <section className="font-inter relative flex h-svh flex-col items-center pt-40">
                <h1 className="text-5xl font-bold tracking-widest sm:text-7xl lg:text-8xl xl:text-9xl">
                    EVROOMA
                </h1>
                <p className="font-inria-sans mt-10 w-[80%] max-w-2xs text-center text-lg opacity-90 sm:text-xl md:text-2xl lg:text-3xl">
                    <strong>Find</strong> Available Classrooms{" "}
                    <strong>Instantly</strong>
                </p>
                <button
                    onClick={() => (window.location.href = "#roles")}
                    className="bottom-0 mt-20 flex cursor-pointer items-center gap-3 rounded-full bg-black px-14 py-3 text-sm font-bold tracking-wider text-white sm:px-20"
                >
                    Continue <ArrowDown size={20} />
                </button>
            </section>
            <section id="roles" className="bg-black-400 relative h-svh">
                <Image
                    src={"/wave.svg"}
                    alt={""}
                    width={200}
                    height={200}
                    loading="eager"
                    className="pointer-events-none absolute bottom-full w-full sm:translate-y-1/12 md:translate-y-1/8 lg:translate-y-1/7"
                />
            </section>
        </>
    );
}
