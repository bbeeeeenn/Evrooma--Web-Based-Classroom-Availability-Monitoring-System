import { BackButton } from "@/app/components/BackButton";
import { instructorDashboardPage, instructorRoomsPage } from "@/constants";
import { FilterRooms } from "./ClientComponents";
import React, { Suspense } from "react";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Building } from "@/app/mongoDb/models/building";
import { connection } from "next/server";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { DoorOpen } from "lucide-react";
import { ClassroomsSkeleton } from "@/app/(site)/admin/(dashboard)/rooms/page";
import Loading from "@/app/(site)/loading";
import clsx from "clsx";
import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { Schedule } from "@/app/mongoDb/models/schedule";
import {
    formatPH,
    GetActiveSchedule,
    getAttendanceDateKey,
} from "@/app/lib/utils";
import { AttendanceLog } from "@/app/mongoDb/models/log";
import ErrorFallback from "@/app/components/ErrorFallback";

async function Filter() {
    await connection();
    let buildings: { name: string; id: string }[];
    try {
        await connectDB();
        buildings = (await Building.find().lean()).map((b) => ({
            name: b.name,
            id: b._id.toString(),
        }));
    } catch (e) {
        return (
            <div className="text-text-primary">
                {e instanceof Error ? e.message : "Unexpected Error"}
            </div>
        );
    }
    return <FilterRooms buildings={buildings} />;
}

async function ClassroomAvailability({ roomId }: { roomId: string }) {
    if (!isValidObjectId(roomId)) return null;
    const now = new Date(formatPH());

    const activeSchedule = await GetActiveSchedule(roomId);
    if (!activeSchedule)
        return (
            <>
                <span className="size-3 rounded-full bg-green-400"></span>
                Available
            </>
        );

    const markedInUsed = await AttendanceLog.findOne({
        schedule: activeSchedule._id,
        user: activeSchedule.instructor,
        attendanceDate: getAttendanceDateKey(now),
    }).lean();

    if (!markedInUsed) {
        return (
            <>
                <span className="size-3 rounded-full bg-green-400"></span>
                Available
            </>
        );
    }

    return (
        <>
            <span className="size-3 rounded-full bg-red-500"></span>
            In Use
        </>
    );
}

async function Classrooms({
    searchParams,
}: {
    searchParams: { b?: string; r?: string };
}) {
    const { b, r } = searchParams;
    let classrooms: PopulatedPlainRoomDocument[];
    try {
        await connectDB();
        classrooms = await Room.find({
            ...(b && { building: b }),
            ...(r && { code: { $regex: r, $options: "i" } }),
        })
            .populate("building")
            .lean();
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }
    return classrooms.map(
        (classroom) =>
            classroom.building && (
                <Link
                    href={`${instructorRoomsPage}/${classroom._id.toString()}`}
                    key={classroom._id.toString()}
                    className="group text-text-primary block w-full space-y-1"
                >
                    <div className="bg-green-secondary group-focus-visible:bg-green-tertiary group-active:bg-green-tertiary group-hover:bg-green-tertiary mt-4 block w-full rounded-md px-5 py-3 shadow-md">
                        <div className="flex items-center gap-1">
                            <span>
                                <DoorOpen size={25} />
                            </span>
                            <p className="items-center gap-2 truncate text-4xl font-bold">
                                {classroom.code}
                            </p>
                        </div>
                        <p className="text-text-secondary text-start font-semibold">
                            {classroom.building.name}
                        </p>
                    </div>
                    <div
                        className={clsx(
                            "bg-green-secondary flex items-center justify-center gap-2 rounded-md py-1 shadow-md",
                            "group-active:bg-green-tertiary group-focus-visible:bg-green-tertiary group-hover:bg-green-tertiary",
                        )}
                    >
                        <ClassroomAvailability
                            roomId={classroom._id.toString()}
                        />
                    </div>
                </Link>
            ),
    );
}

export default async function RoomsPage({
    searchParams,
}: {
    searchParams: Promise<{ b?: string; r?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const newKey = JSON.stringify(resolvedSearchParams);

    return (
        <>
            <BackButton dest={instructorDashboardPage} text="Home" />
            <Suspense fallback={<Loading />}>
                <Filter key={newKey} />
            </Suspense>
            <div className="mt-5">
                <Suspense key={newKey} fallback={<ClassroomsSkeleton />}>
                    <Classrooms searchParams={resolvedSearchParams} />
                </Suspense>
            </div>
        </>
    );
}
