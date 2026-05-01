import Loading from "@/app/(site)/loading";
import { ProcessStudentSchedule } from "@/app/actions/ScheduleActions";
import { QRScanner } from "@/app/components/ScannerComponent";
import { PopulatedPlainScheduleDocument } from "@/app/mongoDb/models/schedule";
import { studentScanPage } from "@/constants";
import clsx from "clsx";
import { CircleAlert, CircleCheckBig } from "lucide-react";
import { isValidObjectId } from "mongoose";
import { Suspense } from "react";

function ScheduleCard({
    schedule,
}: {
    schedule: PopulatedPlainScheduleDocument;
}) {
    const startMeridiem: "AM" | "PM" =
        schedule.slot.start.hour < 12 ? "AM" : "PM";
    const startHour =
        schedule.slot.start.hour % 12 === 0
            ? 12
            : schedule.slot.start.hour % 12;
    const startMinute = schedule.slot.start.minute;
    const endMeridiem: "AM" | "PM" =
        schedule.slot.start.hour < 12 ? "AM" : "PM";
    const endHour =
        schedule.slot.end.hour % 12 === 0 ? 12 : schedule.slot.end.hour % 12;
    const endMinute = schedule.slot.end.minute;

    return (
        <>
            <p className="text-text-primary font-poppins mb-2 text-center text-2xl font-semibold">
                {schedule.room.building.name} - {schedule.room.code}
            </p>
            <div className="bg-green-secondary text-text-primary flex flex-col items-center rounded-md p-3 font-semibold shadow-md">
                <p className="text-yellow-primary text-xl">
                    {schedule.subject}
                </p>
                <p className="font-roboto-mono text-2xl">
                    {startHour}:{startMinute === 0 && "0"}
                    {startMinute}
                    {startMeridiem} - {endHour}:{endMinute === 0 && "0"}
                    {endMinute}
                    {endMeridiem}
                </p>
                <p>{schedule.instructor.fullName}</p>
            </div>
        </>
    );
}

async function Process({ roomid }: { roomid: string }) {
    const { status, message, schedule } = await ProcessStudentSchedule(roomid);
    return (
        <div className="fixed inset-x-5 inset-y-0 m-auto h-fit max-w-5xl">
            {schedule && <ScheduleCard schedule={schedule} />}
            <div
                className={clsx(
                    "text-text-primary m-auto my-5 flex items-center justify-center gap-2 rounded-md p-4 text-sm font-semibold shadow-md",
                    status === "success" ? "bg-green-600" : "bg-red-700",
                )}
            >
                <span>
                    {status === "success" ? (
                        <CircleCheckBig />
                    ) : (
                        <CircleAlert />
                    )}
                </span>
                {message}
            </div>
        </div>
    );
}

async function Suspended({
    searchParams,
}: {
    searchParams: Promise<{ roomid?: string }>;
}) {
    const { roomid } = await searchParams;
    return roomid && isValidObjectId(roomid) ? (
        <Process roomid={roomid} />
    ) : (
        <QRScanner scanUrl={studentScanPage} />
    );
}

export default function Page({
    searchParams,
}: {
    searchParams: Promise<{ roomid?: string }>;
}) {
    return (
        <Suspense fallback={<Loading />}>
            <Suspended searchParams={searchParams} />
        </Suspense>
    );
}
