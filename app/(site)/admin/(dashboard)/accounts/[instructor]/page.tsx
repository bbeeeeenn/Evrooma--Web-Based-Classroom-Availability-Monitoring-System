import { adminAccountsPage, DaysOfWeek } from "@/constants";
import { BackButton } from "@/app/components/BackButton";
import { InstructorInfoComponent, ScheduleCard } from "./ClientComponents";
import { CalendarDays } from "lucide-react";
import React, { Suspense } from "react";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Divider } from "@/app/components/Divider";
import { ScheduleCardSkeleton } from "@/app/(site)/ClientComponents";

async function GetSchedule({ instructorId }: { instructorId: string }) {
    let schedules: PopulatedPlainScheduleDocument[] = []; // Populated Schedule Document
    try {
        await connectDB();
        schedules = await Schedule.find({
            instructor: instructorId,
        })
            .sort({
                "slot.dayOfWeek": 1,
                "slot.start.hour": 1,
                "slot.start.minute": 1,
            })
            .populate({ path: "room", populate: "building" })
            .lean();
    } catch (e) {
        console.error(e);
        return (
            <p className="text-text-primary">
                {e instanceof Error ? e.message : "Unexpected Error"}
            </p>
        );
    }

    let currentDay = -1;

    return schedules.length > 0 ? (
        <>
            {schedules.map((sched) => {
                const startMeridiem: "AM" | "PM" =
                    sched.slot.start.hour < 12 ? "AM" : "PM";
                const startHour =
                    sched.slot.start.hour % 12 === 0
                        ? 12
                        : sched.slot.start.hour % 12;
                const startMinute = sched.slot.start.minute;
                const endMeridiem: "AM" | "PM" =
                    sched.slot.start.hour < 12 ? "AM" : "PM";
                const endHour =
                    sched.slot.end.hour % 12 === 0
                        ? 12
                        : sched.slot.end.hour % 12;
                const endMinute = sched.slot.end.minute;

                const Divide = () => {
                    if (sched.slot.dayOfWeek !== currentDay) {
                        currentDay = sched.slot.dayOfWeek;
                        return <Divider text={DaysOfWeek[currentDay]} />;
                    }
                    return null;
                };

                return (
                    <React.Fragment key={sched._id.toString()}>
                        <Divide />
                        <ScheduleCard
                            _id={sched._id.toString()}
                            building={sched.room.building.name}
                            buildingId={sched.room.building._id.toString()}
                            room={sched.room.code}
                            roomId={sched.room._id.toString()}
                            day={DaysOfWeek[sched.slot.dayOfWeek]}
                            endHour={endHour}
                            endMinute={endMinute}
                            endMeridiem={endMeridiem}
                            startHour={startHour}
                            startMinute={startMinute}
                            startMeridiem={startMeridiem}
                            subject={sched.subject}
                        />
                    </React.Fragment>
                );
            })}
        </>
    ) : (
        <div className="text-text-primary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            There's no set schedule for this instructor.
        </div>
    );
}

export default async function InstructorInfoPage({
    params,
}: {
    params: Promise<{ instructor: string }>;
}) {
    const { instructor: instructorId } = await params;
    return (
        <>
            <BackButton dest={adminAccountsPage} />
            <InstructorInfoComponent />
            <div className="mt-10 flex items-center gap-3 text-white/90">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule instructorId={instructorId} />
            </Suspense>
        </>
    );
}
