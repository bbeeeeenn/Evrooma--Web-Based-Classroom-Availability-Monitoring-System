import Loading from "@/app/(site)/loading";
import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { BackButton } from "@/app/components/BackButton";
import { Divider } from "@/app/components/Divider";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connectDB } from "@/app/mongoDb/mongodb";
import { DaysOfWeek, instructorDashboardPage } from "@/constants";
import { CalendarDays } from "lucide-react";
import React, { Suspense } from "react";

async function GetSchedule({ instructorId }: { instructorId: string }) {
    let schedules: PopulatedPlainScheduleDocument[] = []; // Populated Schedule Document
    try {
        await connectDB();
        schedules = await Schedule.find({
            instructor: instructorId,
        })
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
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
                        <button className="text-text-primary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary border-yellow-primary bg-green-secondary mt-5 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md">
                            <p className="font-roboto-mono text-2xl font-bold">
                                {`${startHour}:${startMinute < 10 ? "0" + startMinute : startMinute}${startMeridiem}`}{" "}
                                -{" "}
                                {`${endHour}:${endMinute < 10 ? "0" + endMinute : endMinute}${endMeridiem}`}
                            </p>
                            <p className="font-poppins font-semibold">
                                <span className="text-yellow-primary">
                                    {sched.room.building.name} -{" "}
                                </span>
                                <span className="text-yellow-primary">
                                    {sched.room.code}
                                </span>{" "}
                                - {sched.subject}
                            </p>
                        </button>
                    </React.Fragment>
                );
            })}
        </>
    ) : (
        <div className="text-text-primary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            There's no set schedule for you.
        </div>
    );
}

async function Schedules() {
    const instructor = await GetInstructorAuthInfo();
    return (
        instructor && <GetSchedule instructorId={instructor._id.toString()} />
    );
}

export default function SchedulesPage() {
    return (
        <>
            <BackButton dest={instructorDashboardPage} />
            <div className="mt-10 flex items-center gap-3 text-white/90">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">My Schedules</h1>
            </div>
            <Suspense fallback={<Loading />}>
                <Schedules />
            </Suspense>
        </>
    );
}
