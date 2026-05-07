import { connectDB } from "@/app/mongoDb/mongodb";
import AddBuilding from "./ClientComponents";
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
import ErrorFallback from "@/app/components/ErrorFallback";
import clsx from "clsx";

async function ClassroomCount({
    buildingId,
}: Readonly<{ buildingId: string }>) {
    let count: number = -1;
    try {
        await connectDB();
        count = await Room.countDocuments({ building: buildingId });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <p className="text-text-secondary text-sm font-medium tracking-wide">
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
                    className="font-poppins bg-green-secondary border-green-secondary/50 min-w-3xs grow rounded-lg border-b-4 px-4 py-3 font-semibold shadow-md transition-transform sm:max-w-sm"
                >
                    <p className="mb-1 w-5/6 animate-pulse truncate bg-white/30 text-xl text-transparent">
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
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <ul className="text-text-primary flex flex-wrap gap-x-6 gap-y-4">
            {buildings.map((b) => (
                <li
                    key={b._id.toString()}
                    className="font-poppins border-green-quarternary bg-green-secondary focus-within:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary min-w-3xs grow rounded-lg border-b-4 text-2xl font-semibold shadow-md transition-transform hover:-translate-y-0.5 sm:max-w-sm"
                >
                    <Link
                        href={adminRoomsPage + "/" + b._id}
                        className="block cursor-pointer px-4 py-3"
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
    await connection();
    return (
        <ul className="-z-50 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
                <li
                    key={i}
                    className="bg-green-secondary block space-y-2 rounded-md px-5 py-3 opacity-50 shadow-md"
                >
                    <p className="h-fit w-fit animate-pulse truncate bg-white/30 text-xl font-bold text-transparent">
                        DUMMY#####
                    </p>
                    <p className="w-fit animate-pulse bg-white/30 text-sm font-semibold text-transparent">
                        Building.......
                    </p>
                </li>
            ))}
        </ul>
    );
}

async function Classrooms() {
    let classrooms: PopulatedPlainRoomDocument[] = [];

    try {
        await connectDB();
        classrooms = await Room.find()
            .populate("building")
            .sort({ building: 1, createdAt: 1 })
            .lean();
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <ul className="space-y-3">
            {classrooms.map((classroom) => {
                if (!classroom.building) {
                    return null;
                }
                return (
                    <li key={classroom._id.toString()}>
                        <Link
                            href={`${adminRoomsPage}/${classroom.building._id}/${classroom._id}`}
                            className={clsx(
                                "bg-green-secondary focus-visible:bg-green-tertiary active:bg-green-tertiary text-text-primary block rounded-md px-5 py-3 shadow-md transition-all",
                                "hover:bg-green-tertiary active:bg-green-tertiary hover:scale-101 active:scale-100",
                            )}
                        >
                            <div className="flex items-center gap-1">
                                <span>
                                    <DoorOpen />
                                </span>
                                <p className="items-center gap-2 truncate text-2xl font-bold">
                                    {classroom.code}
                                </p>
                            </div>
                            <p className="text-text-secondary text-sm font-semibold">
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
            <h1 className="text-text-primary mb-5 text-2xl font-bold">
                Buildings
            </h1>
            <AddBuilding />
            <Suspense fallback={<BuildingListSkeleton />}>
                <BuildingsList />
            </Suspense>
            <h1 className="text-text-primary my-5 text-2xl font-bold">
                Classrooms
            </h1>
            <Suspense fallback={<ClassroomsSkeleton />}>
                <Classrooms />
            </Suspense>
        </>
    );
}
