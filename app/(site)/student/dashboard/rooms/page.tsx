import { instructorRoomsPage, studentRoomsPage } from "@/constants";
import { Suspense } from "react";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Building } from "@/app/mongoDb/models/building";
import { connection } from "next/server";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { DoorOpen } from "lucide-react";
import { ClassroomsSkeleton } from "@/app/(site)/admin/(dashboard)/rooms/page";
import Loading from "@/app/(site)/loading";
import clsx from "clsx";
import Link from "next/link";
import { isValidObjectId } from "mongoose";
import {
    formatPH,
    GetActiveSchedule,
    getAttendanceDateKey,
} from "@/app/lib/utils";
import { AttendanceLog } from "@/app/mongoDb/models/log";
import ErrorFallback from "@/app/components/ErrorFallback";
import { FilterRooms } from "@/app/components/ClassroomComponents";
import { Classrooms } from "@/app/(site)/Components";

async function Filter() {
    await connection();
    let buildings: { name: string; id: string }[];
    try {
        await connectDB();
        buildings = (await Building.find().lean()).map((b) => ({
            name: b.name,
            id: b._id.toString(),
        }));
    } catch (e) {
        return (
            <div className="text-text-primary">
                {e instanceof Error ? e.message : "Unexpected Error"}
            </div>
        );
    }
    return <FilterRooms buildings={buildings} />;
}

export default async function RoomsPage({
    searchParams,
}: {
    searchParams: Promise<{ b?: string; r?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const newKey = JSON.stringify(resolvedSearchParams);

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Filter key={newKey} />
            </Suspense>
            <div className="mt-5">
                <Suspense key={newKey} fallback={<ClassroomsSkeleton />}>
                    <Classrooms
                        searchParams={resolvedSearchParams}
                        roomsUrl={studentRoomsPage}
                    />
                </Suspense>
            </div>
        </>
    );
}
