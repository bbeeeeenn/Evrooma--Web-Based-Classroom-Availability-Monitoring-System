import { adminRoomsPage } from "@/constants";
import { BackButton } from "../../ClientComponents";
import {
    AddClassroomComponent,
    BuildingNameHeader,
    BuildingSettings,
} from "./ClientComponents";
import { Suspense } from "react";
import Link from "next/link";
import {
    PlainRoomDocument,
    PopulatedPlainRoomDocument,
    Room,
} from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";

function Divider({ text }: { text: string }) {
    return (
        <div className="relative my-10 flex items-center justify-center font-bold sm:justify-start">
            <div className="bg-black-400 absolute inset-0 m-auto h-0.5 rounded-full"></div>
            <p className="text-black-400 bg-black-100 text-md absolute w-fit px-2 text-center tracking-wide sm:ml-10 sm:text-lg">
                {text}
            </p>
        </div>
    );
}

async function Classrooms({ buildingId }: { buildingId: string }) {
    let classrooms: PopulatedPlainRoomDocument[] = [];
    await connectDB();
    classrooms = await Room.find({ building: buildingId })
        .populate("building")
        .lean();

    return (
        <>
            {classrooms.map((classroom) => (
                <Link
                    key={classroom._id}
                    href={""}
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
