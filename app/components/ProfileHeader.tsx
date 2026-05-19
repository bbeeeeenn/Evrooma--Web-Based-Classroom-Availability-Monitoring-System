import { BookText, Calendar1, Clock, GraduationCap } from "lucide-react";
import { getPHDateTime } from "../lib/utils";
import { PlainUserDocument } from "../mongoDb/models/user";
import { DaysOfWeek, Months } from "@/constants";

export async function ProfileHeader({
    user,
    type,
}: {
    user: PlainUserDocument;
    type: "instructor" | "student";
}) {
    const now = getPHDateTime();
    const meridiem: "AM" | "PM" = now.hour < 12 ? "AM" : "PM";
    const hour = now.hour % 12 === 0 ? 12 : now.hour % 12;
    const minute = `${now.minute < 10 ? "0" : ""}${now.minute}`;
    return (
        <>
            <div className="text-text-primary flex items-center gap-3">
                <span className="rounded-md border border-white/15 bg-white/10 p-3">
                    {type === "instructor" ? (
                        <BookText size={30} />
                    ) : (
                        <GraduationCap size={30} />
                    )}
                </span>
                <div>
                    <p className="text-text-secondary font-semibold">
                        Welcome,
                    </p>
                    <p className="text-2xl font-bold">{user.fullName}</p>
                </div>
            </div>
            <div className="text-text-secondary font-dm-sans mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1">
                    <span>
                        <Calendar1 size={15} />
                    </span>
                    {DaysOfWeek[now.weekday]}, {Months[now.month]} {now.day}{" "}
                    {now.year}
                </div>
                <div className="flex items-center gap-1">
                    <span>
                        <Clock size={15} />
                    </span>
                    {hour}:{minute} {meridiem}
                </div>
            </div>
        </>
    );
}
