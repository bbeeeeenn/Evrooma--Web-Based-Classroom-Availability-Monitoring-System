import { Suspense } from "react";
import Loading from "../../loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { redirect } from "next/navigation";
import { studentLoginPage, studentRoomsPage } from "@/constants";
import { BookOpen, Check, ChevronRight, User } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { PlainUserDocument } from "@/app/mongoDb/models/user";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "@/app/mongoDb/models/log";
import ErrorFallback from "@/app/components/ErrorFallback";
import { connectDB } from "@/app/mongoDb/mongodb";
import { slotToMinutes, formatPHDateKey } from "@/app/lib/utils";
import { getPHDateTime } from "@/app/lib/clientUtils";
import { GetTimeComponentsFromScheduleDocument } from "@/app/lib/clientUtils";
import EmptyFallback from "@/app/components/EmptyFallback";
import clsx from "clsx";
import Link from "next/link";
import { ProfileHeader } from "@/app/components/ProfileHeader";

async function ClassesAttended({ student }: { student: PlainUserDocument }) {
    const { hour, minute } = getPHDateTime();
    const currentSlot = { hour, minute };
    let attendanceLogs: PopulatedPlainLogDocument[];
    try {
        await connectDB();
        attendanceLogs = await AttendanceLog.find({
            user: student._id,
            attendanceDate: formatPHDateKey(),
        })
            .sort({ createdAt: 1 })
            .populate({
                path: "schedule",
                populate: [
                    "instructor",
                    { path: "room", populate: "building" },
                ],
            })
            .lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <div>
            {attendanceLogs.length > 0 ? (
                attendanceLogs.map((log) => {
                    const {
                        startHour,
                        startMinute,
                        startMeridiem,
                        endHour,
                        endMinute,
                        endMeridiem,
                    } = GetTimeComponentsFromScheduleDocument(log.schedule);
                    const ongoing =
                        slotToMinutes(currentSlot) >=
                            slotToMinutes(log.schedule.slot.start) &&
                        slotToMinutes(currentSlot) <
                            slotToMinutes(log.schedule.slot.end);
                    return (
                        <div
                            key={log._id.toString()}
                            className={clsx(
                                "text-text-primary bg-green-secondary relative my-5 overflow-hidden rounded-md p-4 shadow-md",
                                ongoing && "border-yellow-secondary border-l-4",
                            )}
                        >
                            <p className="font-poppins flex items-center gap-1 text-sm font-semibold">
                                <span>
                                    <BookOpen size={15} />
                                </span>
                                {log.schedule.subject}
                                <span className="ml-2">
                                    <User size={15} />
                                </span>
                                {log.schedule.instructor.fullName}
                            </p>
                            <p className="font-roboto-mono text-yellow-primary text-xl font-semibold">
                                {startHour}:{startMinute}
                                {startMeridiem} - {endHour}:{endMinute}
                                {endMeridiem}
                            </p>
                            <Link
                                tabIndex={-1}
                                href={`${studentRoomsPage}/${log.schedule.room._id.toString()}`}
                                className="font-poppins flex w-fit items-center font-semibold hover:underline active:underline"
                            >
                                <p>
                                    {log.schedule.room.building.name} -{" "}
                                    {log.schedule.room.code}
                                </p>
                                <span>
                                    <ChevronRight size={20} />
                                </span>
                            </Link>
                            <p className="flex items-center gap-1 font-semibold text-green-300">
                                <span>
                                    <Check size={20} />
                                </span>
                                Attended
                            </p>
                        </div>
                    );
                })
            ) : (
                <EmptyFallback text="You haven't gone to any classes today." />
            )}
        </div>
    );
}

async function Suspended() {
    const student = await GetStudentAuthInfo();
    if (!student) redirect(studentLoginPage);

    return (
        <>
            <ProfileHeader user={student} type="student" />
            <Divider text="Classes attended" />
            <Suspense fallback={<Loading />}>
                <ClassesAttended student={student} />
            </Suspense>
        </>
    );
}

export default function StudentPage() {
    return (
        <Suspense fallback={<Loading />}>
            <Suspended />
        </Suspense>
    );
}
