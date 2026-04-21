import { CalendarDays, Plus } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { adminRoomsPage } from "@/constants";
import Link from "next/link";
import { connectDB } from "@/app/mongoDb/mongodb";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { ScheduleCard } from "./ClientComponents";
import { ScheduleCardSkeleton } from "@/app/(site)/ClientComponents";
import { Suspense } from "react";
import { isValidObjectId } from "mongoose";

async function GetSchedule({
    classroomId,
    day,
}: {
    classroomId: string;
    day: string;
}) {
    let schedules: PopulatedPlainScheduleDocument[] = []; // Populated Schedule Document
    if (!isValidObjectId(classroomId)) {
        return <>Error</>;
    }

    try {
        await connectDB();
        schedules = await Schedule.find({
            room: classroomId,
            "slot.dayOfWeek": day,
        })
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
            .populate("instructor")
            .populate({ path: "room", populate: "building" })
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return (
            <div className="text-text-primary">
                {e instanceof Error ? e.message : e}
            </div>
        );
    }
    return (
        schedules.length > 0 && (
            <>
                <Divider text={day} />
                {schedules.map((sched) => {
                    const startMeridiem: "AM" | "PM" =
                        sched.slot.start.hour < 12 ? "AM" : "PM";
                    const startHour =
                        sched.slot.start.hour % 12 === 0
                            ? 12
                            : sched.slot.start.hour % 12;
                    const startMinute = sched.slot.start.minute;
                    const endMeridiem: "AM" | "PM" =
                        sched.slot.end.hour < 12 ? "AM" : "PM";
                    const endHour =
                        sched.slot.end.hour % 12 === 0
                            ? 12
                            : sched.slot.end.hour % 12;
                    const endMinute = sched.slot.end.minute;
                    return (
                        <ScheduleCard
                            key={sched._id.toString()}
                            _id={sched._id.toString()}
                            building={sched.room.building.name}
                            room={sched.room.code}
                            instructorFullName={sched.instructor.fullName}
                            instructorId={sched.instructor._id.toString()}
                            subject={sched.subject}
                            endHour={endHour}
                            endMinute={endMinute}
                            endMeridiem={endMeridiem}
                            startHour={startHour}
                            startMinute={startMinute}
                            startMeridiem={startMeridiem}
                            day={day}
                        />
                    );
                })}
            </>
        )
    );
}

export default async function AdminClassroomPage({
    params,
}: {
    params: Promise<{ building: string; classroom: string }>;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    return (
        <>
            <div className="text-text-primary flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}/create-schedule`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2.5 font-semibold shadow-md"
            >
                <Plus /> Add Schedule
            </Link>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Monday" />
            </Suspense>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Tuesday" />
            </Suspense>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Wednesday" />
            </Suspense>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Thursday" />
            </Suspense>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Friday" />
            </Suspense>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} day="Saturday" />
            </Suspense>
        </>
    );
}
