"use client";
import { adminLoginPage, instructorLoginPage } from "@/constants";
import {
    ArrowDown,
    BookText,
    ChevronRight,
    GraduationCap,
    ShieldUser,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
    const roleRef = useRef<HTMLElement>(null);
    return (
        <>
            <section className="font-inter text-text-primary relative flex h-svh min-h-142.5 snap-start flex-col items-center justify-center overflow-hidden">
                <Image
                    src={"/csu.jpg"}
                    height={2000}
                    width={2000}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <h1
                    className={
                        "text-5xl font-bold tracking-widest sm:text-7xl lg:text-8xl xl:text-9xl"
                    }
                >
                    EVROOMA
                </h1>
                <p className="font-inria-sans text-text-secondary mt-10 w-[80%] max-w-2xs text-center text-lg opacity-90 sm:text-xl md:text-2xl lg:text-3xl">
                    <strong>Find</strong> Available
                    <br />
                    Classrooms <strong>Instantly</strong>
                </p>
                <button
                    onClick={() =>
                        roleRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-yellow-primary hover:bg-yellow-secondary focus-visible:bg-yellow-secondary active:bg-yellow-secondary font-poppins bottom-0 mt-20 flex cursor-pointer items-center justify-center gap-2 rounded-md px-14 py-2.5 text-lg font-semibold tracking-wider text-black/75 sm:px-20"
                >
                    Continue <ChevronRight size={25} />
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
            <section
                ref={roleRef}
                className="bg-green-primary relative h-svh snap-start pt-20"
            >
                <div className="font-inter text-text-primary absolute inset-0 m-auto flex w-[80%] max-w-sm flex-col justify-center">
                    <h1 className="text-center text-2xl font-bold tracking-wide sm:text-3xl">
                        Continue as
                    </h1>
                    <Link
                        href={adminLoginPage}
                        className="bg-green-secondary font-inria-sans focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-lg shadow-md sm:text-xl"
                    >
                        <ShieldUser /> Administrator
                    </Link>
                    <Link
                        href={instructorLoginPage}
                        className="bg-green-secondary font-inria-sans focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-lg shadow-md sm:text-xl"
                    >
                        <BookText /> Instructor
                    </Link>
                    <div className="relative my-5 flex h-10 items-center justify-center">
                        <div className="bg-text-primary absolute inset-0 m-auto h-px rounded-full"></div>
                        <p className="bg-green-primary absolute w-fit px-2 text-center text-sm tracking-widest sm:text-lg">
                            OR
                        </p>
                    </div>
                    <button className="bg-green-secondary font-inria-sans focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-lg shadow-md sm:text-xl">
                        <GraduationCap /> Student
                    </button>
                </div>
            </section>
            <footer className="font-inter bg-yellow-primary snap-start py-1 text-center text-xs text-black">
                © 2026 EVROOMA. All rights reserved.
            </footer>
        </>
    );
}
