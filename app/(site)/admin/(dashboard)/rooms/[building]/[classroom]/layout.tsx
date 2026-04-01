import Loading from "@/app/(site)/loading";
import { ClassroomInfoProvider } from "@/app/contexts/ClassroomProvider";
import { PlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminRoomsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Suspended({
    params,
    children,
}: {
    params: Promise<{ building: string; classroom: string }>;
    children: React.ReactNode;
}) {
    const urlParams = await params;
    if (!isValidObjectId(urlParams.classroom)) {
        redirect(`${adminRoomsPage}/${urlParams.building}`);
    }
    let classroom: PlainRoomDocument;
    try {
        await connectDB();
        classroom = await Room.findById(urlParams.classroom).lean();
        if (!classroom) {
            redirect(`${adminRoomsPage}/${urlParams.building}`);
        }
    } catch (e) {
        if (!(e instanceof Error) || e.message !== "NEXT_REDIRECT")
            console.error(e);
        redirect(`${adminRoomsPage}/${urlParams.building}`);
    }

    return (
        <ClassroomInfoProvider
            info={{
                classroomCode: classroom.code,
                classroomId: classroom._id.toString(),
            }}
        >
            {children}
        </ClassroomInfoProvider>
    );
}

export default function AdminClassroomLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ building: string; classroom: string }>;
}>) {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Suspended params={params}>{children}</Suspended>
            </Suspense>
        </>
    );
}
