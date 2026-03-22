import { connectDB } from "@/app/mongoDb/mongodb";
import { BackButton } from "../SmallComponents";
import AddBuilding from "./AddBuilding";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { connection } from "next/server";
import { Suspense } from "react";
import { Room } from "@/app/mongoDb/models/room";
import Link from "next/link";
import { adminDashboardPage, adminRoomsPage } from "@/constants";

async function ClassroomCount({
    buildingId,
}: Readonly<{ buildingId: string }>) {
    // await new Promise((res) => setTimeout(res, 3000));
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

async function BuildingsList() {
    let buildings: PlainBuildingDocument[] = [];
    try {
        await connection();
        await connectDB();
        buildings = await Building.find().lean<PlainBuildingDocument[]>();
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <ul className="flex flex-wrap gap-x-6 gap-y-4">
            {buildings.map((b) => (
                <li
                    key={b._id}
                    className="font-poppins max-w-sm min-w-3xs grow rounded-lg border-b-4 bg-white text-3xl font-semibold shadow-md transition-transform hover:-translate-y-0.5"
                >
                    <Link
                        href={adminRoomsPage + "/" + b._id}
                        className="block cursor-pointer p-5"
                    >
                        <p className="truncate">{b.name}</p>
                        <Suspense
                            fallback={
                                <p className="text-sm tracking-wide">
                                    Counting...
                                </p>
                            }
                        >
                            <ClassroomCount buildingId={b._id} />
                        </Suspense>
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
            <Suspense fallback={"Loading..."}>
                <BuildingsList />
            </Suspense>
        </>
    );
}
