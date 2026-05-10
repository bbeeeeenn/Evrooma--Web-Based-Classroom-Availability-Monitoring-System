import { LogCard } from "@/app/(site)/Components";
import Loading from "@/app/(site)/loading";
import { BackButton } from "@/app/components/BackButton";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "@/app/mongoDb/models/log";
import { PlainUserDocument, User } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminInstructorsPage } from "@/constants";
import { History } from "lucide-react";
import { Suspense } from "react";

async function Logs({ instructorId }: { instructorId: string }) {
    let logs: PopulatedPlainLogDocument[];
    let instructor: PlainUserDocument;
    try {
        await connectDB();
        instructor = await User.findById(instructorId).lean({ virtuals: true });

        logs = await AttendanceLog.find({ user: instructor?._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "schedule",
                populate: { path: "room", populate: "building" },
            })
            .lean();
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    return (
        <>
            <p className="text-text-primary my-5 flex items-center gap-2 text-2xl font-semibold">
                <span>
                    <History size={30} />
                </span>
                {instructor.lastName}&apos;
                {instructor.lastName.charAt(-1) !== "s" && "s"} Logs
            </p>
            {logs.length <= 0 ? (
                <div className="text-text-primary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
                    Empty
                </div>
            ) : (
                logs.map((log) => (
                    <LogCard key={log._id.toString()} log={log} />
                ))
            )}
        </>
    );
}

export default async function Page({
    params,
}: {
    params: Promise<{ instructor: string }>;
}) {
    const { instructor } = await params;

    return (
        <>
            <BackButton dest={`${adminInstructorsPage}/${instructor}`} />
            <Suspense fallback={<Loading />}>
                <Logs instructorId={instructor} />
            </Suspense>
        </>
    );
}
