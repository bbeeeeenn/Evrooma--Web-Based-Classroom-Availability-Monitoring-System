import { adminInstructorsPage, adminRoomsPage } from "@/constants";
import { CalendarDays, ChevronLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { CreateScheduleForm } from "./ClientComponents";
import { Suspense } from "react";
import { connectDB } from "@/app/mongoDb/mongodb";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { redirect } from "next/navigation";
import NewScheduleProvider, { _Instructor } from "./NewScheduleProvider";
import ErrorFallback from "@/app/components/ErrorFallback";

function CreateScheduleFallback() {
    return (
        <div className="text-text-primary font-poppins bg-green-secondary/20 flex items-center justify-center gap-2 rounded-2xl py-20 text-xl font-semibold tracking-wide shadow-sm sm:text-2xl">
            <span className="animate-spin">
                <LoaderCircle />
            </span>
            <p>Loading...</p>
        </div>
    );
}

async function CreateSchedule({
    buildingId,
    roomId,
}: {
    buildingId: string;
    roomId: string;
}) {
    let instructors: PlainUserDocument[];
    try {
        await connectDB();
        instructors = await User.find({ type: "instructor" }).lean({
            virtuals: true,
        });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    if (instructors.length === 0) {
        redirect(adminInstructorsPage);
    }
    return (
        <NewScheduleProvider classroomId={roomId}>
            <CreateScheduleForm
                buildingId={buildingId}
                classroomId={roomId}
                instructors={instructors.map<_Instructor>((i) => ({
                    id: i._id.toString(),
                    name: i.fullName,
                }))}
            />
        </NewScheduleProvider>
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
            <div className="text-text-primary mt-10 flex items-center gap-3">
                <span>
                    <CalendarDays size={30} />
                </span>
                <h1 className="text-3xl font-bold">New Schedule</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-md"
            >
                <ChevronLeft /> Return
            </Link>
            <Suspense fallback={<CreateScheduleFallback />}>
                <CreateSchedule buildingId={buildingId} roomId={classroomId} />
            </Suspense>
        </>
    );
}
