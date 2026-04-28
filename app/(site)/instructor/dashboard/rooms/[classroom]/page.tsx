import { BackButton } from "@/app/components/BackButton";
import { DaysOfWeek, instructorRoomsPage } from "@/constants";
import { ClassroomHeader } from "./ClientComponents";
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
    formatPH,
    GetActiveSchedule,
    GetTimeComponentsFromScheduleDocument,
    IsInUseSchedule,
    slotToMinutes,
} from "@/app/lib/utils";
import clsx from "clsx";
import { CalendarDays } from "lucide-react";
import { Divider } from "@/app/components/Divider";

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

    let day = -1;
    return schedules.length > 0 ? (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <CalendarDays size={30} />
                <h1 className="text-3xl font-bold">Schedules</h1>
            </div>
            {schedules.map((sched) => {
                const Divide = () => {
                    if (day !== sched.slot.dayOfWeek) {
                        day = sched.slot.dayOfWeek;
                        return <Divider text={DaysOfWeek[day]} />;
                    }
                    return null;
                };
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
                        <Divide />
                        <div className="text-text-primary border-yellow-primary bg-green-secondary mt-1 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md">
                            <p className="font-roboto-mono text-2xl font-bold">
                                {`${startHour}:${startMinute}${startMeridiem}`}{" "}
                                - {`${endHour}:${endMinute}${endMeridiem}`}
                            </p>
                            <p className="font-poppins font-semibold">
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

async function CurrentSession({ roomId }: { roomId: string }) {
    const currentSession = await GetActiveSchedule(roomId);
    if (!currentSession) return null;
    const inUse = !!(await IsInUseSchedule(currentSession));
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
                Current Session
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
                <p className="">{currentSession.instructor.fullName}</p>
            </div>
        </div>
    );
}

async function TodaysSchedule({ roomId }: { roomId: string }) {
    const now = new Date(formatPH());
    try {
        await connectDB();
        const schedules: PopulatedPlainScheduleDocument[] = await Schedule.find(
            {
                room: roomId,
                "slot.dayOfWeek": now.getDay(),
            },
        )
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
            .populate("instructor")
            .lean({ virtuals: true });
        return (
            schedules.length > 0 && (
                <>
                    <div className="bg-green-secondary divide-green-primary relative divide-y-2 rounded-md pt-5 pb-2.5 shadow-md">
                        <div className="bg-yellow-primary absolute top-0 left-0 -translate-y-1/2 rounded-lg rounded-bl-none px-3 py-2 font-semibold">
                            Today's Schedule
                        </div>
                        {schedules.map((sched) => {
                            const {
                                startMeridiem,
                                startHour,
                                startMinute,
                                endMeridiem,
                                endHour,
                                endMinute,
                            } = GetTimeComponentsFromScheduleDocument(sched);
                            return (
                                <div
                                    key={sched._id.toString()}
                                    className="text-text-primary px-5 py-2.5 font-semibold"
                                >
                                    <div
                                        className={clsx(
                                            slotToMinutes(now) >=
                                                slotToMinutes(sched.slot.end) &&
                                                "opacity-50",
                                        )}
                                    >
                                        <p className="text-yellow-primary">
                                            {sched.subject}
                                        </p>
                                        <p className="font-roboto-mono text-xl">
                                            {startHour}:{startMinute}
                                            {startMeridiem} - {endHour}:
                                            {endMinute}
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
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }
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
            <Suspense>
                <CurrentSession roomId={classroom._id.toString()} />
            </Suspense>
            <Suspense>
                <TodaysSchedule roomId={classroom._id.toString()} />
            </Suspense>
            <Suspense>
                <Schedules roomId={roomId} />
            </Suspense>
        </>
    );
}

export default function Page({
    params,
}: {
    params: Promise<{ classroom: string }>;
}) {
    return (
        <>
            <BackButton dest={instructorRoomsPage} text="Rooms" />
            <Suspense fallback={<Loading />}>
                <ClassroomPage params={params} />
            </Suspense>
        </>
    );
}
