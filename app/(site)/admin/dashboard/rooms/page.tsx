import { connectDB } from "@/app/mongoDb/mongodb";
import { BackButton } from "../ClientComponents";
import AddBuilding from "./AddBuilding";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { connection } from "next/server";
import { Suspense } from "react";
import { Room } from "@/app/mongoDb/models/room";
import Link from "next/link";
import { adminDashboardPage, adminRoomsPage } from "@/constants";
import { BuildingIcon } from "lucide-react";

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
        <p className="text-sm tracking-wide">
            <span className="underline">{count}</span> classroom
            {count != 1 ? "s" : ""}
        </p>
    );
}

function BuildingListSkeleton() {
    return (
        <ul className="my-5 flex flex-wrap gap-x-6 gap-y-4 opacity-70">
            {Array.from({ length: 5 }).map((_, i) => (
                <li
                    key={i}
                    className="font-poppins min-w-3xs grow rounded-lg border-b-4 border-gray-200 bg-white p-5 font-semibold shadow-md transition-transform sm:max-w-sm"
                >
                    <p className="mb-1 w-5/6 animate-pulse truncate bg-gray-200 text-2xl text-gray-200">
                        I Love Spaghetti
                    </p>
                    <p className="w-1/2 animate-pulse truncate bg-gray-200 text-sm tracking-wide text-gray-200">
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
        await connection();
        await connectDB();
        buildings = await Building.find()
            .sort({ createdAt: 1 })
            .lean<PlainBuildingDocument[]>();
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <ul className="flex flex-wrap gap-x-6 gap-y-4">
            {buildings.map((b) => (
                <li
                    key={b._id.toString()}
                    className="font-poppins min-w-3xs grow rounded-lg border-b-4 bg-white text-3xl font-semibold shadow-md transition-transform hover:-translate-y-0.5 sm:max-w-sm"
                >
                    <Link
                        href={adminRoomsPage + "/" + b._id}
                        className="block cursor-pointer p-5"
                    >
                        <p className="flex items-center gap-1 truncate">
                            <BuildingIcon />
                            {b.name}
                        </p>
                        <ClassroomCount buildingId={b._id.toString()} />
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function AdminRoomsPage() {
    return (
        <>
            <BackButton dest={adminDashboardPage} />
            <h1 className="mb-10 flex items-center gap-2 text-4xl font-bold">
                Buildings
            </h1>
            <AddBuilding />
            <Suspense fallback={<BuildingListSkeleton />}>
                <BuildingsList />
            </Suspense>
        </>
    );
}
