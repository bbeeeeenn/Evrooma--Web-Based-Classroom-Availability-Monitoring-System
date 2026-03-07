"use client";
import { ArrowRight } from "lucide-react";
import RickRoll from "./components/RickRoll/RickRoll";

export default function Home() {
    return (
        <div className="flex flex-col items-center pt-40">
            <h1 className="text-5xl font-bold tracking-widest">EVROOMA</h1>

            <RickRoll className="m-20">
                <button className="flex cursor-pointer items-center gap-3 rounded-full bg-black px-20 py-2 text-white">
                    Continue <ArrowRight />
                </button>
            </RickRoll>
        </div>
    );
}
