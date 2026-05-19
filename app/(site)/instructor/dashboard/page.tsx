import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { instructorLoginPage, instructorRoomsPage } from "@/constants";
import { BookOpen, Check, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";
import Link from "next/link";
import { Divider } from "@/app/components/Divider";
import {
    type PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connection } from "next/server";
import { connectDB } from "@/app/mongoDb/mongodb";
import { type PlainUserDocument } from "@/app/mongoDb/models/user";
import clsx from "clsx";
import { IsInUseSchedule, slotToMinutes } from "@/app/lib/utils";
import { getPHDateTime } from "@/app/lib/clientUtils";
import { GetTimeComponentsFromScheduleDocument } from "@/app/lib/clientUtils";
import { ProfileHeader } from "@/app/components/ProfileHeader";

async function Profile() {
    const instructor = await GetInstructorAuthInfo();
    if (!instructor) redirect(instructorLoginPage);

    return <ProfileHeader user={instructor} type="instructor" />;
}

async function ScheduleToday() {
    await connection();
    const { hour, minute, weekday } = getPHDateTime();
    const currentSlot = { hour, minute };

    let schedToday: PopulatedPlainScheduleDocument[];
    let instructor: PlainUserDocument | null;
    try {
        instructor = await GetInstructorAuthInfo();
        if (!instructor) return null;

        await connectDB();
        schedToday = await Schedule.find({
            instructor: instructor._id,
            "slot.dayOfWeek": weekday,
        })
            .sort({ "slot.start.hour": 1, "slot.start.minute": 1 })
            .populate({ path: "room", populate: "building" })
            .lean();
    } catch (e) {
        return (
            <div className="text-text-primary">
                {e instanceof Error ? e.message : "Unexpected Error"}
            </div>
        );
    }
    return schedToday.length > 0 ? (
        <>
            {schedToday.map(async (sched) => {
                const {
                    startHour,
                    startMinute,
                    startMeridiem,
                    endHour,
                    endMinute,
                    endMeridiem,
                } = GetTimeComponentsFromScheduleDocument(sched);

                const done = await IsInUseSchedule(sched);
                const ongoing =
                    slotToMinutes(currentSlot) >=
                        slotToMinutes(sched.slot.start) &&
                    slotToMinutes(currentSlot) < slotToMinutes(sched.slot.end);
                const passed =
                    slotToMinutes(currentSlot) >= slotToMinutes(sched.slot.end);

                return (
                    <div
                        key={sched._id.toString()}
                        className={clsx(
                            "text-text-primary bg-green-secondary relative my-5 overflow-hidden rounded-md p-4 shadow-md",
                            ongoing && "border-yellow-secondary border-l-4",
                            passed && "opacity-60",
                        )}
                    >
                        <p className="font-poppins flex items-center gap-1 text-sm font-semibold">
                            <span>
                                <BookOpen size={15} />
                            </span>
                            {sched.subject}
                        </p>
                        <p className="font-roboto-mono text-yellow-primary text-xl font-semibold">
                            {startHour}:{startMinute}
                            {startMeridiem} - {endHour}:{endMinute}
                            {endMeridiem}
                        </p>
                        <Link
                            tabIndex={-1}
                            href={`${instructorRoomsPage}/${sched.room._id.toString()}`}
                            className="font-poppins flex w-fit items-center font-semibold hover:underline active:underline"
                        >
                            <p>
                                {sched.room.building.name} - {sched.room.code}
                            </p>
                            <span>
                                <ChevronRight size={20} />
                            </span>
                        </Link>
                        {done && (
                            <p className="flex items-center gap-1 font-semibold text-green-300">
                                <span>
                                    <Check size={20} />
                                </span>
                                Attended
                            </p>
                        )}
                    </div>
                );
            })}
        </>
    ) : (
        <div className="text-text-primary bg-green-secondary mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            🎉 It&apos;s your day off.
        </div>
    );
}

export default function InstructorPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Profile />
                <Divider text="Today's Schedule" />
                <ScheduleToday />
            </Suspense>
        </>
    );
}
