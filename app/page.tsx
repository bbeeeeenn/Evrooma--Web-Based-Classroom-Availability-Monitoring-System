"use client";
import { ArrowDown, BookText, GraduationCap, ShieldUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="font-inter relative flex h-svh min-h-142.5 flex-col items-center justify-center overflow-hidden">
                <h1
                    className={
                        "text-5xl font-bold tracking-widest sm:text-7xl lg:text-8xl xl:text-9xl"
                    }
                >
                    EVROOMA
                </h1>
                <p className="font-inria-sans mt-10 w-[80%] max-w-2xs text-center text-lg opacity-90 sm:text-xl md:text-2xl lg:text-3xl">
                    <strong>Find</strong> Available Classrooms{" "}
                    <strong>Instantly</strong>
                </p>
                <button
                    onClick={() => (window.location.href = "#roles")}
                    className="outline-black-100 bottom-0 mt-20 flex cursor-pointer items-center gap-3 rounded-full bg-black px-14 py-3 text-sm font-bold tracking-wider text-white outline-2 sm:px-20"
                >
                    Continue <ArrowDown size={20} />
                </button>
                <Image
                    src={"/wave.svg"}
                    alt={""}
                    width={5000}
                    height={200}
                    loading="eager"
                    className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 min-w-3xl translate-y-1/3 object-cover object-center"
                />
            </section>
            <section id="roles" className="bg-black-400 relative h-svh pt-20">
                <div className="font-inter text-black-100 absolute inset-0 m-auto flex w-[80%] max-w-sm flex-col justify-center">
                    <h1 className="text-center text-2xl font-bold tracking-wide sm:text-3xl">
                        Continue as
                    </h1>
                    <Link
                        href={"/admin/login"}
                        className="bg-black-100 font-inria-sans mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-lg text-black sm:text-xl"
                    >
                        <ShieldUser /> Administrator
                    </Link>
                    <button className="bg-black-100 font-inria-sans mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-lg text-black sm:text-xl">
                        <BookText /> Instructor
                    </button>
                    <div className="relative my-5 flex h-10 items-center justify-center">
                        <div className="bg-black-100 absolute inset-0 m-auto h-0.5 rounded-full"></div>
                        <p className="text-black-100 bg-black-400 absolute w-fit px-2 text-center text-sm tracking-widest sm:text-lg">
                            OR
                        </p>
                    </div>
                    <button className="bg-black-100 font-inria-sans flex cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-lg text-black sm:text-xl">
                        <GraduationCap /> Student
                    </button>
                </div>
            </section>
        </>
    );
}
