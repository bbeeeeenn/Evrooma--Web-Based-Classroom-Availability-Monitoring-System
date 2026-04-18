import { adminAccountsPage, adminRoomsPage } from "@/constants";
import { CalendarDays, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CreateScheduleForm } from "./ClientComponents";
import { Suspense } from "react";
import Loading from "@/app/(site)/loading";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Instructor, PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { redirect } from "next/navigation";
import NewScheduleProvider, { _Instructor } from "./NewScheduleProvider";

async function CreateSchedule({
    buildingId,
    roomId,
}: {
    buildingId: string;
    roomId: string;
}) {
    let instructors: PlainInstructorDocument[];
    try {
        await connectDB();
        instructors = await Instructor.find().lean({
            virtuals: true,
        });
        if (instructors.length === 0) {
            redirect(adminAccountsPage);
        }
    } catch (e) {
        if (e instanceof Error && e.message === "NEXT_REDIRECT")
            redirect(adminAccountsPage);
        console.error(e);
        redirect(`${adminRoomsPage}/${buildingId}/${roomId}`);
    }
    return (
        <Suspense fallback={<Loading />}>
            <NewScheduleProvider classroomId={roomId}>
                <CreateScheduleForm
                    buildingId={buildingId}
                    classroomId={roomId}
                    instructors={
                        instructors.map((i) => ({
                            id: i._id.toString(),
                            name: i.fullName,
                        })) as _Instructor[]
                    }
                />
            </NewScheduleProvider>
        </Suspense>
    );
}

export default async function CreateSchedulePage({
    params,
}: {
    params: Promise<{ building: string; classroom: string }>;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    return (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <span>
                    <CalendarDays size={40} />
                </span>
                <h1 className="text-3xl font-bold">New Schedule</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2 font-semibold shadow-md"
            >
                <ChevronLeft /> Return
            </Link>
            <CreateSchedule buildingId={buildingId} roomId={classroomId} />
        </>
    );
}
