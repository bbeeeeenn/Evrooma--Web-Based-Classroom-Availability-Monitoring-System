import Link from "next/link";
import ErrorFallback from "../components/ErrorFallback";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "../mongoDb/models/log";
import { PopulatedPlainRoomDocument, Room } from "../mongoDb/models/room";
import { connectDB } from "../mongoDb/mongodb";
import { DoorOpen } from "lucide-react";
import clsx from "clsx";
import { isValidObjectId } from "mongoose";
import {
    formatPH,
    GetActiveSchedule,
    getAttendanceDateKey,
} from "../lib/utils";

export function ScheduleCardSkeleton() {
    return (
        <div className="text-text-primary bg-green-secondary mt-3 block w-full animate-pulse space-y-1 overflow-hidden rounded-md px-5 py-3 text-start opacity-70 shadow-md">
            <div className="h-7.5 w-1/2 min-w-50 bg-white/5"></div>
            <div className="h-5.5 w-1/3 min-w-20 bg-white/5"></div>
        </div>
    );
}

export function UserListSkeleton() {
    return (
        <ul className="space-y-3 opacity-50">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="bg-green-secondary border-green-tertiary/30 block w-full space-y-2 rounded-md border-b-4 px-5 py-5 shadow-md"
                >
                    <div className="h-6 max-w-2xs animate-pulse bg-white/30"></div>
                    <div className="h-3 max-w-xs animate-pulse bg-white/30"></div>
                </li>
            ))}
        </ul>
    );
}

export function LogCard({
    log,
}: {
    log: PopulatedPlainLogDocument;
}): React.ReactNode {
    if (!log.schedule) {
        return null;
    }
    const date = log.createdAt.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
    });
    const day = log.createdAt.toLocaleDateString("en-PH", {
        weekday: "long",
    });
    const time = log.createdAt.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
    });
    return (
        <div
            key={log._id.toString()}
            className="bg-green-secondary text-text-primary border-green-tertiary relative my-3 grow rounded-md border-2 px-5 py-3 text-sm shadow-md"
        >
            <p>
                Subject:{" "}
                <span className="text-yellow-primary">
                    {log.schedule.subject}
                </span>
            </p>
            <p>
                Venue:{" "}
                <span className="text-yellow-primary">
                    {log.schedule.room.building.name} - {log.schedule.room.code}
                </span>
            </p>
            <p>
                Date:{" "}
                <span className="text-yellow-primary">
                    {date} - {day}
                </span>
            </p>
            <p>
                Time: <span className="text-yellow-primary">{time}</span>
            </p>
            <div className="absolute inset-y-0 left-0 flex -translate-x-1/2 flex-col justify-evenly">
                <div className="bg-green-tertiary h-2 w-5 rounded-full" />
                <div className="bg-green-tertiary h-2 w-5 rounded-full" />
            </div>
        </div>
    );
}

async function ClassroomAvailability({ roomid }: { roomid: string }) {
    if (!isValidObjectId(roomid)) return null;
    const now = new Date(formatPH());

    const activeSchedule = await GetActiveSchedule(roomid);
    if (!activeSchedule)
        return (
            <>
                <span className="size-2.5 rounded-full bg-green-400 text-xs"></span>
                Available
            </>
        );

    const markedInUsed = await AttendanceLog.findOne({
        schedule: activeSchedule._id,
        user: activeSchedule.instructor,
        attendanceDate: getAttendanceDateKey(now),
    }).lean();

    return (
        <>
            <span
                className={clsx(
                    "size-2.5 rounded-full text-xs",
                    markedInUsed ? "bg-red-500" : "bg-green-400",
                )}
            ></span>
            {markedInUsed ? "Occupied" : "Available"}
        </>
    );
}

export async function Classrooms({
    searchParams,
    roomsUrl,
}: {
    searchParams: { b?: string; r?: string };
    roomsUrl: string;
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
                    href={`${roomsUrl}/${classroom._id.toString()}`}
                    key={classroom._id.toString()}
                    className="group text-text-primary block w-full space-y-1"
                >
                    <div className="bg-green-secondary group-focus-visible:bg-green-tertiary group-active:bg-green-tertiary group-hover:bg-green-tertiary mt-4 w-full rounded-md px-5 py-2 shadow-md">
                        <div className="flex items-center gap-1.5 text-xl font-bold">
                            <span>
                                <DoorOpen />
                            </span>
                            <p className="truncate">{classroom.code}</p>
                        </div>
                        <p className="text-text-secondary text-start text-sm font-semibold">
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
                            roomid={classroom._id.toString()}
                        />
                    </div>
                </Link>
            ),
    );
}
