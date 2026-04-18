import { CalendarDays, Plus } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { adminRoomsPage } from "@/constants";
import Link from "next/link";
import { connectDB } from "@/app/mongoDb/mongodb";
import { PlainScheduleDocument, Schedule } from "@/app/mongoDb/models/schedule";
import { PlainInstructorDocument } from "@/app/mongoDb/models/user";

async function GetSchedule({
    classroomId,
    day,
}: {
    classroomId: string;
    day: string;
}) {
    let schedules: (Omit<PlainScheduleDocument, "instructor"> & {
        instructor: PlainInstructorDocument;
    })[] = []; // Populated Schedule Document
    try {
        await connectDB();
        schedules = await Schedule.find({
            room: classroomId,
            "slot.dayOfWeek": day,
        })
            .sort({ "slot.start.hour": 1 })
            .populate("instructor")
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return null;
    }
    return schedules.length > 0 ? (
        <>
            <Divider text={day} />
            {schedules.map((sched) => {
                const startMeridiem: "AM" | "PM" =
                    sched.slot.start.hour < 12 ? "AM" : "PM";
                const startHour =
                    sched.slot.start.hour % 12 === 0
                        ? 12
                        : sched.slot.start.hour % 12;
                const startMinute = sched.slot.start.minute;
                const endMeridiem: "AM" | "PM" =
                    sched.slot.start.hour < 12 ? "AM" : "PM";
                const endHour =
                    sched.slot.end.hour % 12 === 0
                        ? 12
                        : sched.slot.end.hour % 12;
                const endMinute = sched.slot.end.minute;
                return (
                    <button
                        key={sched._id.toString()}
                        className="text-text-primary focus-visible:bg-green-tertiary active:bg-green-tertiary hover:bg-green-tertiary border-yellow-primary bg-green-secondary mt-3 block w-full rounded-md border-l-4 px-5 py-3 text-start shadow-md"
                    >
                        <p className="font-roboto-mono text-2xl font-bold">
                            {`${startHour}:${startMinute < 10 ? "0" + startMinute : startMinute}${startMeridiem}`}{" "}
                            -{" "}
                            {`${endHour}:${endMinute < 10 ? "0" + endMinute : endMinute}${endMeridiem}`}
                        </p>
                        <p className="font-poppins font-semibold">
                            <span className="text-yellow-primary">
                                {sched.instructor.fullName}
                            </span>{" "}
                            - {sched.subject}
                        </p>
                    </button>
                );
            })}
        </>
    ) : null;
}

export default async function AdminClassroomPage({
    params,
}: {
    params: Promise<{ building: string; classroom: string }>;
}) {
    const { building: buildingId, classroom: classroomId } = await params;
    return (
        <>
            <div className="text-text-primary mt-15 flex items-center gap-3">
                <CalendarDays size={40} />
                <h1 className="text-4xl font-bold">Schedules</h1>
            </div>
            <Link
                href={`${adminRoomsPage}/${buildingId}/${classroomId}/create-schedule`}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary my-7 flex w-fit items-center gap-2 rounded-md px-4 py-2.5 font-semibold shadow-md"
            >
                <Plus /> Add Schedule
            </Link>
            <GetSchedule classroomId={classroomId} day="Monday" />
            <GetSchedule classroomId={classroomId} day="Tuesday" />
            <GetSchedule classroomId={classroomId} day="Wednesday" />
            <GetSchedule classroomId={classroomId} day="Thursday" />
            <GetSchedule classroomId={classroomId} day="Friday" />
            <GetSchedule classroomId={classroomId} day="Saturday" />
        </>
    );
}
