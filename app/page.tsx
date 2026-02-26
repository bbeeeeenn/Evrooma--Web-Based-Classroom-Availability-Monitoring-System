"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
    const [rick, setRick] = useState(false);
    return (
        <div className="flex flex-col items-center pt-40">
            <h1 className="text-5xl font-bold">EVROOMA</h1>
            <button
                className="m-20 flex cursor-pointer items-center gap-3 rounded-full bg-black px-20 py-2 text-white"
                onClick={() => setRick(true)}
            >
                Continue <ArrowRight />
            </button>
            {rick && (
                <Image
                    alt=""
                    src={"/rickroll-rick.gif"}
                    width={200}
                    height={200}
                    className="fixed inset-0 h-full w-full bg-black/70 object-contain"
                />
            )}
        </div>
    );
}
