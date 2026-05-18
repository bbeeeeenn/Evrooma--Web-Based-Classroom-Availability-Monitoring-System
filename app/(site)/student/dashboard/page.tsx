import { Suspense } from "react";
import Loading from "../../loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { redirect } from "next/navigation";
import { studentLoginPage, studentRoomsPage } from "@/constants";
import { BookText, Check, ChevronRight, GraduationCap } from "lucide-react";
import { Divider } from "@/app/components/Divider";
import { PlainUserDocument } from "@/app/mongoDb/models/user";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "@/app/mongoDb/models/log";
import ErrorFallback from "@/app/components/ErrorFallback";
import { connectDB } from "@/app/mongoDb/mongodb";
import {
    GetTimeComponentsFromScheduleDocument,
    slotToMinutes,
    formatPHDateKey,
    getPHDateTime,
} from "@/app/lib/utils";
import EmptyFallback from "@/app/components/EmptyFallback";
import clsx from "clsx";
import Link from "next/link";

async function Profile({ student }: { student: PlainUserDocument }) {
    return (
        <div className="text-text-primary flex items-center gap-2">
            <GraduationCap size={45} />
            <div>
                <p className="text-text-secondary font-semibold">Welcome,</p>
                <p className="text-2xl font-bold">{student.fullName}</p>
            </div>
        </div>
    );
}

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
                            <p className="font-poppins flex items-center gap-1 font-semibold">
                                <span>
                                    <BookText size={15} />
                                </span>
                                {log.schedule.subject} -{" "}
                                {log.schedule.instructor.fullName}
                            </p>
                            <p className="font-roboto-mono text-yellow-primary text-2xl font-semibold">
                                {startHour}:{startMinute}
                                {startMeridiem} - {endHour}:{endMinute}
                                {endMeridiem}
                            </p>
                            <Link
                                tabIndex={-1}
                                href={`${studentRoomsPage}/${log.schedule.room._id.toString()}`}
                                className="font-poppins flex w-fit items-center text-lg font-semibold hover:underline active:underline"
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
            <Profile student={student} />
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
