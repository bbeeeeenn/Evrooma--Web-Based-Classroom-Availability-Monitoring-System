import { Divider } from "@/app/components/Divider";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";
import { homePage, instructorScanPage, studentScanPage } from "@/constants";
import clsx from "clsx";
import {
    BookText,
    Building2,
    ChevronLeft,
    ChevronRight,
    DoorOpen,
    GraduationCap,
} from "lucide-react";
import { isValidObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Suspended({
    searchParams,
}: {
    searchParams: Promise<{ roomid?: string }>;
}) {
    const { roomid } = await searchParams;
    if (!roomid || !isValidObjectId(roomid)) {
        redirect(homePage);
    }
    let classroom: PopulatedPlainRoomDocument;
    try {
        await connectDB();
        classroom = await Room.findById(roomid).populate("building").lean();
        if (!classroom) redirect(homePage);
    } catch (e) {
        console.error(e);
        return (
            <div className="text-text-primary font-semibold">
                {e instanceof Error ? e.message : "Unknown Error."}
            </div>
        );
    }

    return (
        <div className="m-auto p-5 sm:p-10">
            <Link
                href={homePage}
                className="text-text-primary group focus-visible:bg-green-secondary focus-visible:border-green-tertiary mb-10 flex w-fit items-center gap-2 rounded-md border border-transparent p-2 text-4xl font-semibold"
            >
                <span>
                    <ChevronLeft />
                </span>
                <Image
                    src={"/favicon_dark.svg"}
                    alt=""
                    height={40}
                    width={40}
                    className=""
                />
                <p className="group-focus-visible:hidden">EVROOMA</p>
                <p className="hidden group-focus-visible:block">Home</p>
            </Link>
            <div className="text-text-primary bg-green-secondary flex items-center gap-3 rounded-lg border border-white/10 p-5">
                <span className="rounded-md border border-white/10 bg-green-200/10 p-3 text-white">
                    <DoorOpen size={25} />
                </span>
                <div>
                    <p className="text-text-secondary/90 text-sm">
                        {classroom.building.name}
                    </p>
                    <p className="text-2xl font-semibold">{classroom.code}</p>
                </div>
            </div>
            <Divider text="Continue as" />
            <div className="space-y-6">
                <Link
                    href={`${instructorScanPage}?roomid=${encodeURIComponent(roomid)}`}
                    className={clsx(
                        "text-text-primary bg-green-secondary flex w-full items-center gap-2 rounded-md border border-white/10 p-4",
                        "hover:border-yellow-primary/50 focus-visible:border-yellow-primary/50 transition",
                    )}
                >
                    <span className="text-yellow-primary rounded-md border border-green-200/10 bg-green-200/15 p-3">
                        <BookText size={25} />
                    </span>
                    <div className="grow">
                        <p className="text-xl font-semibold">Instructor</p>
                        <p className="text-text-primary/70 text-sm">
                            Check in to your class.
                        </p>
                    </div>
                    <span>
                        <ChevronRight />
                    </span>
                </Link>
                <Link
                    href={`${studentScanPage}?roomid=${encodeURIComponent(roomid)}`}
                    className={clsx(
                        "text-text-primary bg-green-secondary flex w-full items-center gap-2 rounded-md border border-white/10 p-4",
                        "hover:border-yellow-primary/50 focus-visible:border-yellow-primary/50 transition",
                    )}
                >
                    <span className="text-yellow-primary rounded-md border border-green-200/10 bg-green-200/15 p-3">
                        <GraduationCap size={25} />
                    </span>
                    <div className="grow">
                        <p className="text-xl font-semibold">Student</p>
                        <p className="text-text-primary/70 text-sm">
                            Mark your attendance
                        </p>
                    </div>
                    <span>
                        <ChevronRight />
                    </span>
                </Link>
            </div>
        </div>
    );
}

export default async function ScanLandingPage({
    searchParams,
}: {
    searchParams: Promise<{ roomid?: string }>;
}) {
    return (
        <Suspense>
            <Suspended searchParams={searchParams} />
        </Suspense>
    );
}
