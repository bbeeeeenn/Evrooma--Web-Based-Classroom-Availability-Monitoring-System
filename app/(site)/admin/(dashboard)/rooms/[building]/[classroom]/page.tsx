import { CalendarDays, Plus } from "lucide-react";
import { BackButton } from "@/app/components/BackButton";
import { Divider } from "@/app/components/Divider";
import { ClassroomCodeHeader, ClassroomSettings } from "./ClientComponents";
import { adminRoomsPage } from "@/constants";
import Link from "next/link";

export default async function AdminClassroomPage({
    params,
}: {
    params: Promise<{ building: string; classroom: string }>;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    return (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}/create-schedule`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2.5 font-semibold shadow-md"
            >
                <Plus /> Add Schedule
            </Link>
            <Divider text="Monday" />
            <Divider text="Tuesday" />
            <Divider text="Wednesday" />
            <Divider text="Thursday" />
            <Divider text="Friday" />
            <Divider text="Saturday" />
            <Divider text="Sunday" />
        </>
    );
}
