import { adminRoomsPage } from "@/constants";
import { CalendarDays, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CreateScheduleForm } from "./ClientComponents";

export default async function CreateSchedulePage({
    params,
}: {
    params: Promise<{ building: string; classroom: string }>;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    return (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">New Schedule</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2 font-semibold shadow-md"
            >
                <ChevronLeft /> Return
            </Link>
            <CreateScheduleForm />
        </>
    );
}
