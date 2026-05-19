import Loading from "@/app/(site)/loading";
import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { CoolSchedules } from "@/app/components/CoolSchedule";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connectDB } from "@/app/mongoDb/mongodb";
import { CalendarDays } from "lucide-react";
import { Suspense } from "react";

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

    const grouped = schedules.reduce(
        (acc, curr) => {
            const key = curr.slot.dayOfWeek;
            if (!acc[key]) acc[key] = [];
            acc[key].push(curr);
            return acc;
        },
        {} as { [key: number]: PopulatedPlainScheduleDocument[] },
    );

    const groupedSchedules = JSON.parse(
        JSON.stringify(grouped),
    ) as typeof grouped;

    return <CoolSchedules groupedSchedules={groupedSchedules} type="room" />;
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
            <div className="mt-3 mb-10 flex items-center gap-3 text-white/90">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">My Schedules</h1>
            </div>
            <Suspense fallback={<Loading />}>
                <Schedules />
            </Suspense>
        </>
    );
}
