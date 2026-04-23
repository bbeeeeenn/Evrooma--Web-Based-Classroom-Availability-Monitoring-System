import { BackButton } from "@/app/components/BackButton";
import { instructorDashboardPage } from "@/constants";
import { FilterRooms } from "./ClientComponents";
import { Suspense } from "react";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Building } from "@/app/mongoDb/models/building";
import { connection } from "next/server";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { DoorOpen } from "lucide-react";
import { ClassroomsSkeleton } from "@/app/(site)/admin/(dashboard)/rooms/page";
import Loading from "@/app/(site)/loading";

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

async function Classrooms({
    searchParams,
}: {
    searchParams: { b?: string; r?: string };
}) {
    const { b, r } = searchParams;
    let classrooms: PopulatedPlainRoomDocument[];
    try {
        await connectDB();
        classrooms = await Room.find({
            ...(b && { building: b }),
            ...(r && { code: { $regex: r, $options: "i" } }),
        })
            .populate("building")
            .lean();
    } catch (e) {
        console.error(e);
        return (
            <div className="text-text-primary">
                {e instanceof Error ? e.message : "Unexpected Error"}
            </div>
        );
    }
    return classrooms.map((classroom) => {
        // TODO: chain delete all the schedules related to this classroom if the building is already deleted. Do it with server-action
        if (!classroom.building) {
            return null;
        }
        return (
            <button
                key={classroom._id.toString()}
                className="bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary text-text-primary mb-4 block w-full rounded-md px-5 py-3 shadow-md"
            >
                <div className="flex items-center gap-1">
                    <span>
                        <DoorOpen size={25} />
                    </span>
                    <p className="items-center gap-2 truncate text-4xl font-bold">
                        {classroom.code}
                    </p>
                </div>
                <p className="text-text-secondary text-start font-semibold">
                    {classroom.building.name}
                </p>
            </button>
        );
    });
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
            <BackButton dest={instructorDashboardPage} />
            <Suspense fallback={<Loading />}>
                <Filter key={newKey} />
            </Suspense>
            <div className="mt-5 space-y-4">
                <Suspense key={newKey} fallback={<ClassroomsSkeleton />}>
                    <Classrooms searchParams={resolvedSearchParams} />
                </Suspense>
            </div>
        </>
    );
}
