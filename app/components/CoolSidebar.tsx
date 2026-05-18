"use client";
import { homePage } from "@/constants";
import clsx from "clsx";
import { ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type SidebarItems = {
    text: string;
    icon: React.ReactNode;
    href: string;
    pushdown?: boolean;
}[];

export function CoolSidebar({
    children,
    items,
}: {
    children: React.ReactNode;
    items: SidebarItems;
}) {
    const sidebar = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);
    const pathname = usePathname();
    const isMd = screenWidth >= 768;

    useEffect(() => {
        if (open) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
    }, [open]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize(); // set initial width
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleBurgerClick = () => setOpen((prev) => !prev);
    return (
        <>
            <div
                inert={isMd}
                className="text-text-primary bg-green-quarternary border-yellow-secondary fixed inset-x-0 top-0 z-20 flex items-center border-b-2 py-5.25 text-xl font-bold tracking-widest transition-transform duration-300 md:-translate-y-full"
            >
                <button className="absolute left-5" onClick={handleBurgerClick}>
                    {open ? <X size={30} /> : <Menu size={30} />}
                </button>
                <Link
                    href={homePage}
                    onClick={() => setOpen(false)}
                    className="mx-auto flex items-center gap-3"
                >
                    <Image
                        src="/favicon_dark.svg"
                        alt=""
                        height={30}
                        width={30}
                    />
                    <p>EVROOMA</p>
                </Link>
            </div>

            <div className="flex transition-all duration-300 md:pl-[min(20rem,calc(33.333%))]">
                <main
                    inert={open && !isMd}
                    className={
                        "font-inter has-[.accountform]:bg-green-secondary m-auto w-full overflow-hidden px-5 pt-21 pb-20 transition-all duration-300 sm:has-[.accountform]:bg-transparent md:px-7 md:pt-3"
                    }
                >
                    {children}
                </main>
            </div>

            {/* Big Screen Sidebar */}
            <div
                inert={!isMd}
                className={clsx(
                    "bg-green-quarternary font-poppins text-text-primary fixed inset-y-0 left-0 z-11 flex w-1/3 max-w-xs -translate-x-[calc(100%+4px)] flex-col overflow-x-hidden overflow-y-auto shadow-xl transition-transform duration-300 md:translate-x-0",
                )}
            >
                <Link
                    href={homePage}
                    onClick={() => setOpen(false)}
                    className="font-inter border-yellow-secondary mx-auto flex w-full items-center justify-center gap-3 border-b-2 py-5 text-2xl font-bold tracking-widest"
                >
                    <Image
                        src="/favicon_dark.svg"
                        alt=""
                        height={30}
                        width={30}
                    />
                    <p>EVROOMA</p>
                </Link>
                {items.map((item, i) => (
                    <Link
                        key={i}
                        inert={pathname === item.href}
                        href={item.href}
                        className={clsx(
                            "hover:bg-green-quinary group active:bg-green-quinary focus-visible:bg-green-quinary h-fit w-full px-5 py-4 text-xl font-semibold",
                            pathname === item.href &&
                                "bg-yellow-primary pointer-events-none text-black",
                            item.pushdown && "mt-auto",
                        )}
                    >
                        <div className="flex items-center gap-4 transition-transform group-hover:translate-x-3 group-active:translate-x-0">
                            <span>{item.icon}</span>
                            <p className="truncate">{item.text}</p>
                            <span className="ml-auto">
                                <ChevronRight size={30} />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile Sidebar */}
            <div
                inert={isMd || !open}
                className={clsx(
                    "fixed inset-0 z-10 h-full w-full transition-colors md:pointer-events-none md:bg-transparent",
                    open ? "bg-black/20" : "pointer-events-none",
                )}
                onClick={({ clientX: x }) => {
                    if (!sidebar.current) return;
                    const { right } = sidebar.current.getBoundingClientRect();
                    if (x > right) setOpen(false);
                }}
            >
                <div
                    ref={sidebar}
                    className={clsx(
                        "bg-green-quarternary font-poppins text-text-primary fixed inset-y-0 left-0 z-11 flex w-full max-w-sm flex-col overflow-x-hidden overflow-y-auto pt-18.5 transition-all duration-300 md:-translate-x-full",
                        !open && "-translate-x-[calc(100%+10px)]",
                    )}
                >
                    {items.map((item, i) => (
                        <Link
                            key={i}
                            inert={pathname === item.href}
                            href={item.href}
                            className={clsx(
                                "hover:bg-green-quinary group active:bg-green-quinary focus-visible:bg-green-quinary h-fit w-full px-5 py-4 text-xl font-semibold",
                                pathname === item.href &&
                                    "bg-yellow-primary pointer-events-none text-black",
                                item.pushdown && "mt-auto",
                            )}
                            onClick={() => setOpen(false)}
                        >
                            <div className="flex items-center gap-4 transition-transform group-hover:translate-x-3 group-active:translate-x-3">
                                <span>{item.icon}</span>
                                <p className="truncate">{item.text}</p>
                                <span className="ml-auto">
                                    <ChevronRight size={30} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
