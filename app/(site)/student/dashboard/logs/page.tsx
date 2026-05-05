import { LogCard } from "@/app/(site)/Components";
import Loading from "@/app/(site)/loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    AttendanceLog,
    PopulatePlainLogDocument,
} from "@/app/mongoDb/models/log";
import { connectDB } from "@/app/mongoDb/mongodb";
import { LogsIcon } from "lucide-react";
import { Suspense } from "react";

async function Logs() {
    const student = await GetStudentAuthInfo();
    let logs: PopulatePlainLogDocument[];
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

    if (logs.length <= 0)
        return (
            <div className="text-text-primary bg-green-secondary/20 mt-10 rounded-md p-10 text-center text-xl font-semibold shadow-md">
                Empty
            </div>
        );

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
