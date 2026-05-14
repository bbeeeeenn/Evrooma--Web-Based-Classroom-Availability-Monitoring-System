"use client";
import {
    adminLoginPage,
    instructorLoginPage,
    studentLoginPage,
} from "@/constants";
import clsx from "clsx";
import {
    ArrowRight,
    BookText,
    ChevronRight,
    GraduationCap,
    MapPin,
    ShieldUser,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
    const roleRef = useRef<HTMLElement>(null);

    return (
        <div className="relative h-dvh w-dvw snap-y snap-mandatory scrollbar-thin overflow-x-hidden overflow-y-auto perspective-[10px]">
            <div className="absolute inset-0 -z-10 transform-3d">
                <Image
                    src={"/csu.jpg"}
                    height={2000}
                    width={2000}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 h-full w-full -translate-z-2.5 scale-200 object-cover"
                />
            </div>

            <section className="to-green-primary from-green-primary/50 flex h-dvh snap-start flex-col justify-end bg-linear-to-b from-30% to-80% p-5 sm:p-10">
                <div className="text-yellow-primary bg-yellow-primary/20 border-yellow-primary/35 mb-4 flex w-fit min-w-0 items-center gap-1 rounded-full border-2 px-3 py-2 text-sm font-semibold">
                    <span>
                        <MapPin size={17} />
                    </span>
                    <p className="hidden truncate sm:block">
                        Caraga State University - Main Campus
                    </p>
                    <p className="block truncate sm:hidden">
                        CSU - Main Campus
                    </p>
                </div>
                <h1 className="text-text-primary font-inter flex items-center gap-2 text-5xl font-semibold sm:text-8xl">
                    Evrooma
                </h1>
                <p className="text-text-primary/80 font-inter text-base font-medium sm:text-xl">
                    Find available classrooms, instantly.
                </p>
                <button
                    className={clsx(
                        "text-text-primary group mt-8 flex items-center justify-center gap-2 rounded-lg border border-white/50 px-5 py-2 text-xl font-semibold shadow-md sm:w-fit",
                        "hover:border-yellow-primary focus-visible:border-yellow-primary active:border-yellow-primary hover:text-yellow-primary focus-visible:text-yellow-primary active:text-yellow-primary hover:bg-yellow-primary/10 focus-visible:bg-yellow-primary/10 active:bg-yellow-primary/10",
                    )}
                    onClick={() =>
                        roleRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                >
                    Get started
                    <span>
                        <ArrowRight />
                    </span>
                </button>
            </section>
            <section
                ref={roleRef}
                className="bg-green-primary h-dvh snap-start overflow-y-auto p-7 sm:p-10"
            >
                <p className="text-text-primary flex items-center gap-2 text-3xl font-semibold sm:text-5xl">
                    <span>
                        <Image
                            src="/favicon_dark.svg"
                            alt=""
                            height={30}
                            width={30}
                            className="sm:hidden"
                        />
                        <Image
                            src="/favicon_dark.svg"
                            alt=""
                            height={47}
                            width={47}
                            className="hidden sm:block"
                        />
                    </span>
                    Evrooma
                </p>
                <p className="mt-4 text-white/60">Choose how to continue</p>
                <p className="mt-8 text-white/60">Who are you?</p>
                <div className="my-5 flex flex-wrap gap-5">
                    <Link
                        href={instructorLoginPage}
                        className="border-yellow-primary/30 hover:bg-yellow-primary/10 focus-visible:bg-yellow-primary/10 flex grow items-center gap-2 rounded-xl border bg-white/5 p-5 text-white/60 transition-colors sm:flex-col sm:items-start"
                    >
                        <span className="text-yellow-primary bg-yellow-primary/10 rounded-lg p-2">
                            <BookText size={30} />
                        </span>
                        <div className="grow">
                            <p className="text-text-primary text-lg font-semibold">
                                Instructor
                            </p>
                            <p className="text-sm">
                                Check your schedules and rooms
                            </p>
                        </div>
                        <span className="sm:hidden">
                            <ChevronRight />
                        </span>
                    </Link>
                    <Link
                        href={studentLoginPage}
                        className="border-yellow-primary/30 hover:bg-yellow-primary/10 focus-visible:bg-yellow-primary/10 flex grow items-center gap-2 rounded-xl border bg-white/5 p-5 text-white/60 transition-colors sm:flex-col sm:items-start"
                    >
                        <span className="text-yellow-primary bg-yellow-primary/10 rounded-lg p-2">
                            <GraduationCap size={30} />
                        </span>
                        <div className="grow">
                            <p className="text-text-primary text-lg font-semibold">
                                Student
                            </p>
                            <p className="text-sm">
                                View your classes and attendance
                            </p>
                        </div>
                        <span className="sm:hidden">
                            <ChevronRight />
                        </span>
                    </Link>
                </div>
                <div className="relative my-10 flex items-center justify-center font-semibold">
                    <div className="absolute inset-0 m-auto h-px rounded-full bg-white/40"></div>

                    <p className="bg-green-primary text-md absolute w-fit px-2 text-center tracking-wide text-white/40">
                        or sign in as
                    </p>
                </div>
                <Link
                    href={adminLoginPage}
                    className="border-yellow-primary/30 hover:bg-yellow-primary/10 focus-visible:bg-yellow-primary/10 flex grow items-center gap-2 rounded-xl border bg-white/5 p-5 text-white/60 transition-colors"
                >
                    <span className="rounded-lg p-2">
                        <ShieldUser size={30} />
                    </span>
                    <div className="grow">
                        <p className="text-text-primary text-lg font-semibold">
                            Administrator
                        </p>
                        <p className="text-sm">Full system management</p>
                    </div>
                    <span>
                        <ChevronRight />
                    </span>
                </Link>
            </section>
            {/* <footer className="font-inter bg-yellow-primary snap-start py-1 text-center text-xs text-black">
                © 2026 EVROOMA. All rights reserved.
            </footer> */}
        </div>
    );
}
