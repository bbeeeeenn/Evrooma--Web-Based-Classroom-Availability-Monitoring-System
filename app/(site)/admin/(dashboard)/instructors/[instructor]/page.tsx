import { adminInstructorsPage, DaysOfWeek } from "@/constants";
import { BackButton } from "@/app/components/BackButton";
import { InstructorInfoComponent, ScheduleCard } from "./ClientComponents";
import { CalendarDays } from "lucide-react";
import { Fragment, Suspense } from "react";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Divider } from "@/app/components/Divider";
import { ScheduleCardSkeleton } from "@/app/(site)/Components";

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

    return schedules.length > 0 ? (
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
                    sched.slot.start.hour < 12 ? "AM" : "PM";
                const endHour =
                    sched.slot.end.hour % 12 === 0
                        ? 12
                        : sched.slot.end.hour % 12;
                const endMinute = sched.slot.end.minute;

                const Divide = () => {
                    if (
                        i === 0 ||
                        sched.slot.dayOfWeek !== schedules[i - 1].slot.dayOfWeek
                    ) {
                        return (
                            <Divider text={DaysOfWeek[sched.slot.dayOfWeek]} />
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
                    </Fragment>
                );
            })}
        </>
    ) : (
        <div className="text-text-primary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            There&apos;s no set schedule for this instructor yet.
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
            <BackButton dest={adminInstructorsPage} />
            <InstructorInfoComponent />
            <div className="mt-10 flex items-center gap-3 text-white/90">
                <CalendarDays size={30} className="inline" />
                <h1 className="text-3xl font-bold">Schedules</h1>
            </div>
            <Suspense fallback={<ScheduleCardSkeleton />}>
                <GetSchedule instructorId={instructorId} />
            </Suspense>
        </>
    );
}
