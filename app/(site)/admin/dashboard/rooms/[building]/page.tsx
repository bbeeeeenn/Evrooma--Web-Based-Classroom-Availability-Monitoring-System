import { adminRoomsPage } from "@/constants";
import { BackButton } from "../../SmallComponents";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { redirect } from "next/navigation";

export default async function BuildingPage({
    params,
}: Readonly<{ params: Promise<{ building: string }> }>) {
    const { building } = await params;
    let buildingName: string = "Error";
    try {
        await connectDB();
        buildingName =
            (await Building.findById(building).lean<PlainBuildingDocument>())
                ?.name ?? "Error";
    } catch (error) {
        console.error(error);
        redirect(adminRoomsPage);
    }
    return (
        <>
            <BackButton dest={adminRoomsPage} />
            <h1 className="mb-10 flex items-center gap-2 text-4xl font-bold">
                {buildingName}
            </h1>
        </>
    );
}
