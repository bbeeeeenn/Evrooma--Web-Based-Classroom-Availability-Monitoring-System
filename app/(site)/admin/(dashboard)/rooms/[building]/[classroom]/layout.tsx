import Loading from "@/app/(site)/loading";
import { BackButton } from "@/app/components/BackButton";
import { ClassroomInfoProvider } from "@/app/contexts/ClassroomProvider";
import { PlainRoomDocument, Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminRoomsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ClassroomCodeHeader, ClassroomSettings } from "./ClientComponents";
import { Divider } from "@/app/components/Divider";
import { CalendarDays } from "lucide-react";

function Classroom({ buildingId }: { buildingId: string }) {
    return (
        <>
            <BackButton dest={`${adminRoomsPage}/${buildingId}`} />
            <ClassroomCodeHeader />
            <Divider text="Settings" />
            <ClassroomSettings />
        </>
    );
}

async function Suspended({
    params,
    children,
}: {
    params: Promise<{ building: string; classroom: string }>;
    children: React.ReactNode;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    if (!isValidObjectId(classroomId)) {
        redirect(`${adminRoomsPage}/${buildingId}`);
    }
    let classroom: PlainRoomDocument;
    try {
        await connectDB();
        classroom = await Room.findOne({
            _id: classroomId,
            building: buildingId,
        }).lean();
        if (!classroom) {
            redirect(`${adminRoomsPage}/${buildingId}`);
        }
    } catch (e) {
        if (!(e instanceof Error) || e.message !== "NEXT_REDIRECT")
            console.error(e);
        redirect(`${adminRoomsPage}/${buildingId}`);
    }

    return (
        <ClassroomInfoProvider
            info={{
                classroomCode: classroom.code,
                classroomId: classroom._id.toString(),
            }}
        >
            <Classroom buildingId={buildingId} />
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
