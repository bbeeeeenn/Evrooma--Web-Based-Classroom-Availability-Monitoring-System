import Loading from "@/app/(site)/loading";
import { Building, PlainBuildingDocument } from "@/app/mongoDb/models/building";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminRoomsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BuildingNameProvider } from "@/app/contexts/BuildingNameProvider";
import { connection } from "next/server";

async function Suspended({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ building: string }>;
}) {
    const { building: buildingId } = await params;
    if (!isValidObjectId(buildingId)) {
        // TODO: return a jsx saying building not found instead
        redirect(adminRoomsPage);
    }
    let building: PlainBuildingDocument;
    try {
        await connectDB();
        building = await Building.findById(buildingId).lean();
        if (!building) {
            // TODO: return a jsx saying building not found instead
            redirect(adminRoomsPage);
        }
    } catch (error) {
        if (!(error instanceof Error) || error.message !== "NEXT_REDIRECT")
            console.error(error);
        redirect(adminRoomsPage);
    }

    return (
        <BuildingNameProvider key={building.name} name={building.name}>
            {children}
        </BuildingNameProvider>
    );
}

export default async function Layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ building: string }>;
}>) {
    return (
        <Suspense fallback={<Loading />}>
            <Suspended params={params}>{children}</Suspended>
        </Suspense>
    );
}
