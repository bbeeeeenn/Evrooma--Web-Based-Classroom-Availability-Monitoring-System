import { connectDB } from "@/app/mongoDb/mongodb";
import AddBuilding from "./ClientComponents";
import { Divider } from "../../ClientComponents";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { Suspense } from "react";
import {
    type PopulatedPlainRoomDocument,
    Room,
} from "@/app/mongoDb/models/room";
import Link from "next/link";
import { adminRoomsPage } from "@/constants";
import { Building2, DoorOpen } from "lucide-react";
import { connection } from "next/server";

async function ClassroomCount({
    buildingId,
}: Readonly<{ buildingId: string }>) {
    let count: number = -1;
    try {
        await connectDB();
        count = await Room.countDocuments({ building: buildingId });
    } catch (error) {
        console.error(error);
    }

    return (
        <p className="text-sm font-medium tracking-wide">
            <span className="underline">{count}</span> classroom
            {count != 1 ? "s" : ""}
        </p>
    );
}

function BuildingListSkeleton() {
    return (
        <ul className="my-5 flex flex-wrap gap-x-6 gap-y-4 opacity-50">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="font-poppins bg-green-secondary border-green-tertiary/50 min-w-3xs grow rounded-lg border-b-4 p-5 font-semibold shadow-md transition-transform sm:max-w-sm"
                >
                    <p className="mb-1 w-5/6 animate-pulse truncate bg-white/30 text-2xl text-transparent">
                        I Love Spaghetti
                    </p>
                    <p className="w-1/2 animate-pulse truncate bg-white/30 text-sm tracking-wide text-transparent">
                        Hell yeah... Fuck the cops...
                    </p>
                </li>
            ))}
        </ul>
    );
}

async function BuildingsList() {
    let buildings: PlainBuildingDocument[] = [];
    try {
        await connectDB();
        buildings = await Building.find()
            .sort({ createdAt: 1 })
            .lean<PlainBuildingDocument[]>();
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <ul className="flex flex-wrap gap-x-6 gap-y-4 text-white/95">
            {buildings.map((b) => (
                <li
                    key={b._id.toString()}
                    className="font-poppins border-yellow-primary bg-green-secondary min-w-3xs grow rounded-lg border-b-4 text-3xl font-semibold shadow-md transition-transform hover:-translate-y-0.5 sm:max-w-sm"
                >
                    <Link
                        href={adminRoomsPage + "/" + b._id}
                        className="block cursor-pointer p-5"
                    >
                        <p className="flex items-center gap-1 truncate">
                            <Building2 />
                            {b.name}
                        </p>
                        <ClassroomCount buildingId={b._id.toString()} />
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export async function ClassroomsSkeleton() {
    return (
        <ul>
            {Array.from({ length: 4 }).map((_, i) => (
                <li
                    key={i}
                    className="bg-green-secondary mb-4 block space-y-2 px-5 py-3 opacity-50 shadow-md"
                >
                    <p className="h-fit w-fit animate-pulse truncate bg-white/30 text-2xl font-bold text-transparent">
                        DUMMY
                        {Array.from({
                            length: Math.ceil(7 * Math.random()),
                        }).map(() => "#")}
                    </p>
                    <p className="w-fit animate-pulse bg-white/30 font-semibold text-transparent">
                        Building.......
                    </p>
                </li>
            ))}
        </ul>
    );
}

async function Classrooms() {
    let classrooms: PopulatedPlainRoomDocument[] = [];
    await connectDB();
    classrooms = await Room.find()
        .populate("building")
        .sort({ building: 1, createdAt: 1 })
        .lean();

    let currBuilding = "";

    return (
        <ul>
            {classrooms.map((classroom) => {
                // TODO: chain delete all the schedules related to this classroom if the building is already deleted. Do it with server-action
                if (!classroom.building) {
                    return null;
                }
                const BuildingDiv = () => {
                    if (currBuilding !== classroom.building.name) {
                        currBuilding = classroom.building.name;
                        return <Divider text={currBuilding} />;
                    }
                    return null;
                };
                return (
                    <li key={classroom._id.toString()}>
                        <BuildingDiv />
                        <Link
                            href={`${adminRoomsPage}/${classroom.building._id}/${classroom._id}`}
                            className="bg-green-secondary border-yellow-primary mb-4 block border-r-4 px-5 py-3 text-white/95 shadow-md"
                        >
                            <p className="flex items-center gap-2 truncate text-4xl font-bold">
                                <DoorOpen size={25} /> {classroom.code}
                            </p>
                            <p className="font-semibold">
                                {classroom.building.name}
                            </p>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export default async function AdminRoomsPage() {
    await connection();
    return (
        <>
            <h1 className="mb-10 text-4xl font-bold text-white/95">
                Buildings
            </h1>
            <AddBuilding />
            <Suspense fallback={<BuildingListSkeleton />}>
                <BuildingsList />
            </Suspense>
            <h1 className="my-10 text-4xl font-bold text-white/95">
                Classrooms
            </h1>
            <Suspense fallback={<ClassroomsSkeleton />}>
                <Classrooms />
            </Suspense>
        </>
    );
}
