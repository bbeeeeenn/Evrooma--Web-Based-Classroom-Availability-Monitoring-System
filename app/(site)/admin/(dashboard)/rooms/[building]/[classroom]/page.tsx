import { CalendarDays, CalendarPlus } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { adminRoomsPage, DaysOfWeek } from "@/constants";
import Link from "next/link";
import { connectDB } from "@/app/mongoDb/mongodb";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { ScheduleCard } from "./ClientComponents";
import { ScheduleCardSkeleton } from "@/app/(site)/Components";
import { Fragment, Suspense } from "react";
import ErrorFallback from "@/app/components/ErrorFallback";

async function GetSchedule({ classroomId }: { classroomId: string }) {
    let schedules: PopulatedPlainScheduleDocument[] = []; // Populated Schedule Document
    try {
        await connectDB();
        schedules = await Schedule.find({
            room: classroomId,
        })
            .sort({
                "slot.dayOfWeek": 1,
                "slot.start.hour": 1,
                "slot.start.minute": 1,
            })
            .populate("instructor")
            .populate({ path: "room", populate: "building" })
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        schedules.length > 0 && (
            <>
                {schedules.map((sched, i) => {
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
                    const Divide = () => {
                        if (
                            i === 0 ||
                            sched.slot.dayOfWeek !==
                                schedules[i - 1].slot.dayOfWeek
                        ) {
                            return (
                                <Divider
                                    text={DaysOfWeek[sched.slot.dayOfWeek]}
                                />
                            );
                        }
                        return null;
                    };
                    return (
                        <Fragment key={sched._id.toString()}>
                            <Divide />
                            <ScheduleCard
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
                                day={DaysOfWeek[sched.slot.dayOfWeek]}
                            />
                        </Fragment>
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
            <div className="text-text-primary mt-10 flex items-center gap-3">
                <CalendarDays size={30} />
                <h1 className="text-3xl font-bold">Schedules</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}/create-schedule`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary fixed right-5 bottom-5 z-10 flex w-fit items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-md md:right-11 md:bottom-11"
            >
                <CalendarPlus /> Create Schedule
            </Link>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule classroomId={classroomId} />
            </Suspense>
        </>
    );
}
