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

async function Classrooms({ buildingId }: { buildingId: string }) {
    let classrooms: PopulatedPlainRoomDocument[] = [];
    await connectDB();
    classrooms = await Room.find({ building: buildingId })
        .populate("building")
        .sort()
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
            <BuildingSettings buildingId={buildingId} />
            <Divider text="Classrooms" />
            <AddClassroomComponent buildingId={buildingId} />
            <Suspense fallback={"Loading Classrooms..."}>
                <Classrooms buildingId={buildingId} />
            </Suspense>
        </>
    );
}
