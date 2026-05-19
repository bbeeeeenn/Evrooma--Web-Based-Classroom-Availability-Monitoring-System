import { adminInstructorsPage } from "@/constants";
import { BackButton } from "@/app/components/BackButton";
import { InstructorInfoComponent } from "./ClientComponents";
import { CalendarDays } from "lucide-react";
import { Suspense } from "react";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connectDB } from "@/app/mongoDb/mongodb";
import { ScheduleCardSkeleton } from "@/app/(site)/Components";
import { AdminCoolSchedules } from "../../AdminCoolSchedule";

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

    return (
        <AdminCoolSchedules
            groupedSchedules={groupedSchedules}
            type="instructor"
        />
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
