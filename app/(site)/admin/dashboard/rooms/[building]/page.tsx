import { adminRoomsPage } from "@/constants";
import { BackButton } from "../../ClientComponents";
import {
    AddClassroomComponent,
    BuildingNameHeader,
    BuildingSettings,
    Divider,
} from "./ClientComponents";
import { Suspense } from "react";
import Link from "next/link";
import { PopulatedPlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";

function ClassroomsSkeleton() {
    return (
        <ul>
            {Array.from({ length: 4 }).map((_, i) => (
                <li
                    key={i}
                    className="mb-4 block space-y-2 bg-white px-5 py-3 opacity-70 shadow-md"
                >
                    <p className="h-fit w-fit animate-pulse truncate bg-gray-200 text-2xl font-bold text-gray-200">
                        DUMMY
                        {Array.from({
                            length: Math.ceil(7 * Math.random()),
                        }).map(() => "#")}
                    </p>
                    <p className="w-fit animate-pulse bg-gray-200 font-semibold text-gray-200">
                        Building.......
                    </p>
                </li>
            ))}
        </ul>
    );
}

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
                    className="mb-4 block border-r-4 bg-white px-5 py-3 shadow-md"
                >
                    <p className="truncate text-4xl font-bold">
                        {classroom.code}
                    </p>
                    <p className="font-semibold">{classroom.building.name}</p>
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
