import { LogCard } from "@/app/(site)/Components";
import Loading from "@/app/(site)/loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import EmptyFallback from "@/app/components/EmptyFallback";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "@/app/mongoDb/models/log";
import { connectDB } from "@/app/mongoDb/mongodb";
import { LogsIcon } from "lucide-react";
import { Suspense } from "react";

async function Logs() {
    const student = await GetStudentAuthInfo();
    let logs: PopulatedPlainLogDocument[];
    try {
        await connectDB();
        logs = await AttendanceLog.find({ user: student?._id })
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

    if (logs.length <= 0) return <EmptyFallback text="Empty" />;

    return logs.map((log) => <LogCard key={log._id.toString()} log={log} />);
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <p className="text-text-primary mt-5 mb-10 flex items-center gap-2 text-2xl font-semibold">
                <span>
                    <LogsIcon size={30} />
                </span>
                My Logs
            </p>
            <Logs />
        </Suspense>
    );
}
