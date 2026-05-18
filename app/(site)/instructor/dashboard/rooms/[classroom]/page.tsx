import { BackButton } from "@/app/components/BackButton";
import { DaysOfWeek, instructorRoomsPage } from "@/constants";
import React, { Suspense } from "react";
import { connectDB } from "@/app/mongoDb/mongodb";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import Loading from "@/app/(site)/loading";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    getPHDateTime,
    GetActiveSchedule,
    GetTimeComponentsFromScheduleDocument,
    IsInUseSchedule,
    slotToMinutes,
} from "@/app/lib/utils";
import clsx from "clsx";
import { CalendarDays, Check, CircleQuestionMark, X } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { ClassroomHeader } from "@/app/components/ClassroomComponents";
import { headers } from "next/headers";

async function Schedules({ roomId }: { roomId: string }) {
    let schedules: PopulatedPlainScheduleDocument[];
    try {
        await connectDB();
        schedules = await Schedule.find({ room: roomId })
            .sort({
                "slot.dayOfWeek": 1,
                "slot.start.hour": 1,
                "slot.start.minute": 1,
            })
            .populate("instructor")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return schedules.length > 0 ? (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <CalendarDays size={30} />
                <h1 className="text-3xl font-bold">Schedules</h1>
            </div>
            {schedules.map((sched, i) => {
                const showDivider =
                    i === 0 ||
                    sched.slot.dayOfWeek !== schedules[i - 1].slot.dayOfWeek;
                const {
                    startMeridiem,
                    startHour,
                    startMinute,
                    endMeridiem,
                    endHour,
                    endMinute,
                } = GetTimeComponentsFromScheduleDocument(sched);
                return (
                    <React.Fragment key={sched._id.toString()}>
                        {showDivider && (
                            <Divider text={DaysOfWeek[sched.slot.dayOfWeek]} />
                        )}
                        <div className="text-text-primary bg-green-secondary mt-3 block w-full rounded-md px-5 py-3 text-start shadow-md">
                            <p className="font-roboto-mono text-xl font-bold">
                                {`${startHour}:${startMinute}${startMeridiem}`}{" "}
                                - {`${endHour}:${endMinute}${endMeridiem}`}
                            </p>
                            <p className="font-poppins text-sm font-semibold">
                                <span className="text-yellow-primary">
                                    {sched.instructor.fullName}
                                </span>{" "}
                                - {sched.subject}
                            </p>
                        </div>
                    </React.Fragment>
                );
            })}
        </>
    ) : (
        <div className="bg-yellow-primary rounded-md p-4 shadow-md">
            <p className="font-poppins text-center text-xl font-semibold text-black">
                No Schedules
            </p>
            <p className="text-center text-black/80">
                This classroom has no scheduled time slots at the moment;
                therefore, it is currently marked available at all times.
            </p>
        </div>
    );
}

async function OngoingSchedule({ roomId }: { roomId: string }) {
    const currentSession = await GetActiveSchedule(roomId);
    if (!currentSession) return null;
    const inUse = await IsInUseSchedule(currentSession);

    const {
        startHour,
        startMinute,
        startMeridiem,
        endHour,
        endMinute,
        endMeridiem,
    } = GetTimeComponentsFromScheduleDocument(currentSession);
    return (
        <div className="text-text-primary bg-green-secondary relative my-15 flex rounded-md pt-5 pb-2.5 font-bold shadow-md">
            <div className="bg-yellow-primary absolute top-0 left-0 -translate-y-1/2 rounded-lg rounded-bl-none px-3 py-2 font-semibold text-black">
                Now
            </div>
            <div
                key={currentSession._id.toString()}
                className="text-text-primary px-5 py-2.5 font-semibold"
            >
                <p className="text-yellow-primary">{currentSession.subject}</p>
                <p className="font-roboto-mono text-xl">
                    {startHour}:{startMinute}
                    {startMeridiem} - {endHour}:{endMinute}
                    {endMeridiem}
                </p>
                <p>{currentSession.instructor.fullName}</p>
                <p className="flex items-center gap-1 font-semibold text-green-300">
                    {inUse ? (
                        <>
                            <span>
                                <Check size={20} />
                            </span>
                            Instructor is present
                        </>
                    ) : (
                        <>
                            <span>
                                <X size={20} />
                            </span>
                            Unverified
                            <span className="group relative ml-1 cursor-pointer">
                                <CircleQuestionMark size={15} />
                                <span className="bg-green-quarternary border-green-quinary text-text-primary pointer-events-none absolute bottom-[calc(100%+4px)] w-80 -translate-x-3/7 rounded-md border-2 px-3 py-2 text-center text-sm font-normal opacity-0 shadow-md transition-all group-hover:opacity-100 group-active:opacity-100">
                                    <strong>Unverified</strong>: The instructor
                                    for this schedule has not scanned the QR
                                    code in this classroom.
                                </span>
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

async function TodaysSchedule({ roomId }: { roomId: string }) {
    const { hour, minute, weekday } = getPHDateTime();
    const currentSlot = { hour, minute };
    let schedules: PopulatedPlainScheduleDocument[];
    try {
        await connectDB();
        schedules = await Schedule.find({
            room: roomId,
            "slot.dayOfWeek": weekday,
        })
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
            .populate("instructor")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }
    return (
        schedules.length > 0 && (
            <>
                <Divider text="Today's Schedule" />
                <div className="bg-green-secondary divide-green-primary divide-y-2 rounded-md shadow-md">
                    {schedules.map((sched) => {
                        const {
                            startMeridiem,
                            startHour,
                            startMinute,
                            endMeridiem,
                            endHour,
                            endMinute,
                        } = GetTimeComponentsFromScheduleDocument(sched);
                        const ongoing =
                            slotToMinutes(currentSlot) >=
                                slotToMinutes(sched.slot.start) &&
                            slotToMinutes(currentSlot) <
                                slotToMinutes(sched.slot.end);
                        const passed =
                            slotToMinutes(currentSlot) >=
                            slotToMinutes(sched.slot.end);
                        return (
                            <div
                                key={sched._id.toString()}
                                className={clsx(
                                    "text-text-primary px-5 py-2.5 font-semibold",
                                    ongoing &&
                                        "border-l-yellow-primary border-l-3",
                                )}
                            >
                                <div className={clsx(passed && "opacity-50")}>
                                    <p className="text-yellow-primary">
                                        {sched.subject}
                                    </p>
                                    <p className="font-roboto-mono text-xl">
                                        {startHour}:{startMinute}
                                        {startMeridiem} - {endHour}:{endMinute}
                                        {endMeridiem}
                                    </p>
                                    <p className="">
                                        {sched.instructor.fullName}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        )
    );
}

async function ClassroomPage({
    params,
}: {
    params: Promise<{ classroom: string }>;
}) {
    const roomId = (await params).classroom;
    if (!isValidObjectId(roomId)) redirect(instructorRoomsPage);
    let classroom: PopulatedPlainRoomDocument;

    try {
        await connectDB();
        classroom = await Room.findById(roomId).populate("building").lean();
    } catch (e) {
        console.error(e);
        return (
            <div className="text-text-primary font-semibold">
                {e instanceof Error ? e.message : "Unexpected Error."}
            </div>
        );
    }

    if (!classroom) {
        redirect(instructorRoomsPage);
    }

    return (
        <>
            <ClassroomHeader
                buildingName={classroom.building.name}
                classroomCode={classroom.code}
            />
            <Suspense fallback={<Loading />}>
                <OngoingSchedule roomId={classroom._id.toString()} />
                <TodaysSchedule roomId={classroom._id.toString()} />
                <Schedules roomId={roomId} />
            </Suspense>
        </>
    );
}

export default async function Page({
    params,
}: {
    params: Promise<{ classroom: string }>;
}) {
    const referer = (await headers()).get("referer");
    return (
        <>
            <BackButton
                dest={instructorRoomsPage}
                text="Rooms"
                referer={referer}
            />
            <Suspense fallback={<Loading />}>
                <ClassroomPage params={params} />
            </Suspense>
        </>
    );
}
