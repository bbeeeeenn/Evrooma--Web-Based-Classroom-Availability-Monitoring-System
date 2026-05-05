import { adminRoomsPage } from "@/constants";
import {
    AddClassroomComponent,
    BuildingNameHeader,
    BuildingSettings,
} from "./ClientComponents";
import { Divider } from "@/app/components/Divider";
import { Suspense } from "react";
import Link from "next/link";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";
import { ClassroomsSkeleton } from "../page";
import { BackButton } from "@/app/components/BackButton";
import ErrorFallback from "@/app/components/ErrorFallback";
import { DoorOpen } from "lucide-react";

async function Classrooms({ buildingId }: { buildingId: string }) {
    let classrooms: PopulatedPlainRoomDocument[] = [];

    try {
        await connectDB();
        classrooms = await Room.find({ building: buildingId })
            .populate("building")
            .sort({ createdAt: 1 })
            .lean();
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <>
            {classrooms.map((classroom) => (
                <Link
                    key={classroom._id.toString()}
                    href={`${adminRoomsPage}/${buildingId}/${classroom._id}`}
                    className="bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary mb-3 block rounded-md px-5 py-3 shadow-md"
                >
                    <p className="text-text-primary flex items-center gap-1 truncate text-2xl font-bold">
                        <span>
                            <DoorOpen />
                        </span>
                        {classroom.code}
                    </p>
                    <p className="text-text-secondary text-sm font-semibold">
                        {classroom.building.name}
                    </p>
                </Link>
            ))}
        </>
    );
}

export default async function BuildingPage({
    params,
}: Readonly<{ params: Promise<{ building: string }> }>) {
    const { building: buildingId } = await params;
    return (
        <>
            <BackButton dest={adminRoomsPage} />
            <BuildingNameHeader />
            <Divider text="Settings" />
            <BuildingSettings />
            <Divider text="Classrooms" />
            <AddClassroomComponent />
            <Suspense fallback={<ClassroomsSkeleton />}>
                <Classrooms buildingId={buildingId} />
            </Suspense>
        </>
    );
}
