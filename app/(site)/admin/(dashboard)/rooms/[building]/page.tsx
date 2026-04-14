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

async function Classrooms({ buildingId }: { buildingId: string }) {
    let classrooms: PopulatedPlainRoomDocument[] = [];
    await connectDB();
    classrooms = await Room.find({ building: buildingId })
        .populate("building")
        .sort({ createdAt: 1 })
        .lean();

    return (
        <>
            {classrooms.map((classroom) => (
                <Link
                    key={classroom._id.toString()}
                    href={`${adminRoomsPage}/${buildingId}/${classroom._id}`}
                    className="bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary mb-4 block px-5 py-3 shadow-md"
                >
                    <p className="text-text-primary truncate text-4xl font-bold">
                        {classroom.code}
                    </p>
                    <p className="text-text-secondary font-semibold">
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
