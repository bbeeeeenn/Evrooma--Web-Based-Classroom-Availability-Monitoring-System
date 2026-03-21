import { connectDB } from "@/app/mongoDb/mongodb";
import { BackButton } from "../SmallComponents";
import AddBuilding from "./AddBuilding";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { connection } from "next/server";

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
        <ul className="space-y-5">
            {buildings.map((b) => (
                <li
                    key={b._id}
                    className="font-poppins cursor-pointer rounded-lg bg-white p-5 text-3xl font-semibold shadow-md"
                >
                    <p className="truncate">{b.name}</p>
                </li>
            ))}
        </ul>
    );
}

export default function AdminRoomsPage() {
    return (
        <>
            <BackButton />
            <h1 className="mb-10 flex items-center gap-2 text-4xl font-bold">
                Buildings
            </h1>
            <AddBuilding />
            <BuildingsList />
        </>
    );
}
