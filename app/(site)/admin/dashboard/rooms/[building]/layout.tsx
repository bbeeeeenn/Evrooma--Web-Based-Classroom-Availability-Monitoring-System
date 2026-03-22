import Loading from "@/app/(site)/loading";
import { adminRoomsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ building: string }>;
}>) {
    const { building: buildingId } = await params;
    if (!isValidObjectId(buildingId)) {
        redirect(adminRoomsPage);
    }

    return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
