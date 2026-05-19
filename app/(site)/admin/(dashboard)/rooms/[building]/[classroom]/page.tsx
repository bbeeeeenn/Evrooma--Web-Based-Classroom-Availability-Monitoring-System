import { CalendarDays, CalendarPlus } from "lucide-react";
import { adminRoomsPage } from "@/constants";
import Link from "next/link";
import { connectDB } from "@/app/mongoDb/mongodb";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { ScheduleCardSkeleton } from "@/app/(site)/Components";
import { Suspense } from "react";
import ErrorFallback from "@/app/components/ErrorFallback";
import { AdminCoolSchedules } from "@/app/(site)/admin/(dashboard)/AdminCoolSchedule";

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
        <>
            <AdminCoolSchedules
                groupedSchedules={groupedSchedules}
                type="room"
            />
        </>
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
