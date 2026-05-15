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
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    MapPin,
    ShieldUser,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
    const landRef = useRef<HTMLElement>(null);
    const roleRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative h-dvh w-dvw snap-y snap-mandatory overflow-hidden perspective-[10px]">
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

            <section
                ref={landRef}
                className="to-green-primary from-green-primary/50 flex h-dvh flex-col justify-end bg-linear-to-b from-30% to-80% p-5 sm:p-10"
            >
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
                        "text-text-primary group bg-green-secondary mt-8 flex items-center justify-center gap-2 rounded-lg border border-transparent px-8 py-2 text-xl font-semibold shadow-md sm:w-fit",
                        "active:border-yellow-primary focus-visible:border-yellow-primary hover:scale-101",
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
            <div
                className="bg-green-primary -translate-y-0.5 transform-3d"
                ref={roleRef}
            >
                <section className="bg-green-primary h-dvh translate-z-1.25 scale-50 scrollbar-thin overflow-y-auto p-7 pt-7.5 sm:p-10 sm:pt-10.5">
                    <p
                        className="text-text-primary flex cursor-pointer items-center gap-2 text-3xl font-semibold sm:text-5xl"
                        onClick={() =>
                            landRef.current?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                    >
                        <span>
                            <ChevronLeft />
                        </span>
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
                            className="bg-green-secondary active:border-yellow-primary focus-visible:border-yellow-primary flex grow items-center gap-2 rounded-xl border border-transparent p-5 text-white/60 shadow-md transition-transform hover:scale-101 sm:flex-col sm:items-start"
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
                            className="bg-green-secondary active:border-yellow-primary focus-visible:border-yellow-primary flex grow items-center gap-2 rounded-xl border border-transparent p-5 text-white/60 shadow-md transition-transform hover:scale-101 sm:flex-col sm:items-start"
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
                        className="bg-green-secondary active:border-yellow-primary focus-visible:border-yellow-primary flex grow items-center gap-2 rounded-xl border border-transparent p-5 text-white/60 shadow-md transition-transform hover:scale-101"
                    >
                        <span className="text-text-primary rounded-lg p-2">
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
        </div>
    );
}
