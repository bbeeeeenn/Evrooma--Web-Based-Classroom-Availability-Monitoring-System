"use client";
import {
    studentDashboardPage,
    studentLogoutPage,
    studentLogsPage,
    studentRoomsPage,
    studentScanPage,
} from "@/constants";
import clsx from "clsx";
import {
    ChevronUp,
    DoorClosed,
    Logs,
    ScanLine,
    SquareArrowRightExit,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function StudentNavbar() {
    const [shown, setShown] = useState(true);
    const pathname = usePathname();

    return (
        [studentDashboardPage, studentRoomsPage, studentLogsPage].includes(
            pathname,
        ) && (
            <nav
                className={clsx(
                    "bg-green-quarternary border-yellow-secondary fixed inset-x-0 bottom-0 z-50 m-auto flex justify-evenly border-t-2 pt-3 pb-2 font-bold tracking-wide text-white shadow-md transition-transform sm:inset-x-1/12 sm:bottom-4 sm:max-w-xl sm:rounded-xl sm:border-2 sm:py-4",
                    !shown &&
                        "translate-y-full sm:translate-y-[calc(100%+1rem)]",
                )}
            >
                {!pathname.includes(studentScanPage) && (
                    <Link
                        href={studentScanPage}
                        className={clsx(
                            "absolute right-5 bottom-[calc(100%+1.25rem)] block w-fit cursor-pointer rounded-full border-3 p-3 sm:hidden",
                            "text-text-primary/95 bg-green-tertiary border-green-secondary",
                            "hover:bg-yellow-primary hover:border-yellow-primary hover:text-black",
                            "active:bg-yellow-primary active:border-yellow-primary active:text-black",
                            "focus-visible:bg-yellow-primary focus-visible:border-yellow-primary focus-visible:text-black",
                        )}
                    >
                        <ScanLine size={30} />
                    </Link>
                )}
                <button
                    className={clsx(
                        "absolute bottom-full mb-1 cursor-pointer rounded-full border-0 p-1 backdrop-blur-xs transition-transform",
                        shown ? "rotate-180" : "animate-bounce",
                    )}
                    onClick={() => setShown((prev) => !prev)}
                >
                    <ChevronUp size={30} />
                </button>
                <div className="flex grow">
                    <Link
                        href={
                            pathname.includes(studentRoomsPage)
                                ? studentDashboardPage
                                : studentRoomsPage
                        }
                        tabIndex={shown ? 0 : -1}
                        className={clsx(
                            "group m-auto flex cursor-pointer flex-col items-center gap-2 text-xs decoration-2 underline-offset-4 sm:flex-row sm:gap-3 sm:text-base",
                            pathname.includes(studentRoomsPage) && "underline",
                        )}
                    >
                        <DoorClosed className="transition-transform group-hover:scale-110 group-focus:scale-110 group-active:scale-110" />{" "}
                        Rooms
                    </Link>
                </div>
                <div className="flex grow">
                    <Link
                        href={
                            pathname.includes(studentLogsPage)
                                ? studentDashboardPage
                                : studentLogsPage
                        }
                        tabIndex={shown ? 0 : -1}
                        className={clsx(
                            "group m-auto flex cursor-pointer flex-col items-center gap-2 text-xs decoration-2 underline-offset-4 sm:flex-row sm:gap-3 sm:text-base",
                            pathname.includes(studentLogsPage) && "underline",
                        )}
                    >
                        <Logs className="transition-transform group-hover:scale-110 group-focus:scale-110 group-active:scale-110" />{" "}
                        My Logs
                    </Link>
                </div>
                <div className="flex grow">
                    <Link
                        href={studentLogoutPage}
                        tabIndex={shown ? 0 : -1}
                        className="group m-auto flex cursor-pointer flex-col items-center gap-2 text-xs decoration-2 sm:flex-row sm:gap-3 sm:text-base"
                    >
                        <SquareArrowRightExit className="transition-transform group-hover:scale-110 group-focus:scale-110 group-active:scale-110" />{" "}
                        Logout
                    </Link>
                </div>
            </nav>
        )
    );
}
