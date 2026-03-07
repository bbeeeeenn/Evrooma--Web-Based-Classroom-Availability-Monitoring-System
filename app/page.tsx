"use client";
import {
    ArrowDown,
    BookOpenText,
    BookText,
    GraduationCap,
    ShieldUser,
} from "lucide-react";
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
            <section id="roles" className="bg-black-400 relative h-svh pt-20">
                <Image
                    src={"/wave.svg"}
                    alt={""}
                    width={200}
                    height={200}
                    loading="eager"
                    className="pointer-events-none absolute bottom-full w-full sm:translate-y-1/12 md:translate-y-1/8 lg:translate-y-1/7"
                />
                <div className="font-inter text-black-100 absolute inset-0 m-auto flex w-[80%] max-w-sm flex-col justify-center">
                    <h1 className="text-center text-3xl font-bold tracking-wide">
                        Continue as
                    </h1>
                    <button className="bg-black-100 font-inria-sans mt-8 flex items-center justify-center gap-2 rounded-full py-2 text-xl text-black">
                        <ShieldUser /> Administrator
                    </button>
                    <button className="bg-black-100 font-inria-sans mt-5 flex items-center justify-center gap-2 rounded-full py-2 text-xl text-black">
                        <BookText /> Instructor
                    </button>
                    <div className="relative my-5 flex h-10 items-center justify-center">
                        <div className="bg-black-100 absolute inset-0 m-auto h-0.5"></div>
                        <p className="text-black-100 bg-black-400 absolute w-fit px-2 text-center tracking-widest">
                            OR
                        </p>
                    </div>
                    <button className="bg-black-100 font-inria-sans flex items-center justify-center gap-2 rounded-full py-2 text-xl text-black">
                        <GraduationCap /> Student
                    </button>
                </div>
            </section>
        </>
    );
}
