import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { instructorLoginPage } from "@/constants";
import { BookText, Building2, DoorOpen, Settings2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";
import Link from "next/link";
import { Divider } from "@/app/components/Divider";
import {
    PopulatedPlainScheduleDocument,
    Schedule,
} from "@/app/mongoDb/models/schedule";
import { connection } from "next/server";
import { ObjectId } from "mongoose";
import { connectDB } from "@/app/mongoDb/mongodb";

async function Profile() {
    const instructor = await GetInstructorAuthInfo();
    if (!instructor) redirect(instructorLoginPage);

    return (
        <div className="flex items-end justify-between gap-5">
            <div className="text-text-primary flex items-center gap-2">
                <BookText size={45} />
                <div>
                    <p className="text-text-secondary font-semibold">
                        Welcome,
                    </p>
                    <p className="text-2xl font-bold">{instructor.fullName}</p>
                </div>
            </div>
            <Link
                href={""}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary font-poppins flex items-center justify-center gap-2 rounded-md p-2 px-3 text-sm font-semibold text-black shadow-md"
            >
                <Settings2 size={20} />{" "}
                <span className="hidden sm:inline">Settings</span>
            </Link>
        </div>
    );
}

async function ScheduleToday() {
    await connection();
    const day = new Date().getDay();
    let schedToday: (Omit<PopulatedPlainScheduleDocument, "instructor"> & {
        instructor: ObjectId;
    })[];
    try {
        const instructor = await GetInstructorAuthInfo();
        if (!instructor) return <>asd</>;

        await connectDB();
        schedToday = await Schedule.find({
            instructor: instructor._id,
            "slot.dayOfWeek": day,
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
        schedToday.map((sched) => {
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
                sched.slot.end.hour % 12 === 0 ? 12 : sched.slot.end.hour % 12;
            const endMinute = sched.slot.end.minute;
            return (
                <div
                    key={sched._id.toString()}
                    className="text-text-primary bg-green-secondary my-5 rounded-md p-4 shadow-md"
                >
                    <p className="font-poppins text-yellow-primary font-semibold">
                        {sched.subject}
                    </p>
                    <p className="font-roboto-mono text-2xl font-semibold">
                        {startHour}:{startMinute < 30 && "0"}
                        {startMinute}
                        {startMeridiem} - {endHour}:{endMinute < 30 && "0"}
                        {endMinute}
                        {endMeridiem}
                    </p>
                    <p className="font-poppins font-semibold">
                        {sched.room.building.name} - {sched.room.code}
                    </p>
                </div>
            );
        })
    ) : (
        <div className="text-text-primary bg-green-secondary mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
            🎉 It's your day off.
        </div>
    );
}

export default function InstructorPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Profile />
            </Suspense>
            <Divider text="Today's Schedule" />
            <Suspense>
                <ScheduleToday />
            </Suspense>
        </>
    );
}
