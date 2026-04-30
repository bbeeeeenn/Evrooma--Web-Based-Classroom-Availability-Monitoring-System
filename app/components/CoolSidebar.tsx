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
    const pathname = usePathname();

    useEffect(() => {
        if (open) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
    }, [open]);

    const handleBurgerClick = () => setOpen((prev) => !prev);
    return (
        <>
            <div className="text-text-primary bg-green-quarternary border-yellow-primary fixed inset-x-0 top-0 z-20 flex items-center gap-3 border-b-2 py-5 text-xl font-bold tracking-widest">
                {/* <button
                    className="absolute left-3 sm:hidden"
                    onClick={handleBurgerClick}
                >
                    {open ? <X /> : <Menu />}
                </button> */}
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

            <main
                inert={open}
                className={
                    "font-inter has-[.accountform]:bg-green-secondary m-auto max-w-5xl px-5 pt-21 pb-20 sm:has-[.accountform]:bg-transparent"
                }
            >
                {children}
            </main>
            <div
                className={clsx(
                    "fixed inset-0 z-10 h-full w-full transition-colors",
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
                        "bg-green-quarternary font-poppins text-text-primary fixed top-17.5 bottom-0 left-0 z-11 flex w-9/10 max-w-xs flex-col overflow-hidden transition-transform",
                        !open && "-translate-x-[calc(100%+4px)]",
                    )}
                >
                    {items.map((item, i) => (
                        <Link
                            key={i}
                            inert={pathname === item.href}
                            href={item.href}
                            className={clsx(
                                "hover:bg-green-quinary active:bg-green-quinary focus-visible:bg-green-quinary flex h-fit w-full items-center gap-4 px-7 py-5 text-2xl font-semibold",
                                pathname === item.href &&
                                    "bg-yellow-primary pointer-events-none text-black",
                                item.pushdown && "mt-auto",
                            )}
                            onClick={() => setOpen(false)}
                        >
                            <span>{item.icon}</span>
                            <p className="truncate">{item.text}</p>
                            <span className="ml-auto">
                                <ChevronRight size={30} />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
