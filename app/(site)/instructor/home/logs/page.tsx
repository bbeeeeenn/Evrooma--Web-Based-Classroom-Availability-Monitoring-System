import Loading from "@/app/(site)/loading";
import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    AttendanceLog,
    PopulatePlainLogDocument,
} from "@/app/mongoDb/models/log";
import { connectDB } from "@/app/mongoDb/mongodb";
import { History, LogsIcon } from "lucide-react";
import { Suspense } from "react";

async function Logs() {
    const instructor = await GetInstructorAuthInfo();
    let logs: PopulatePlainLogDocument[];
    try {
        await connectDB();
        logs = await AttendanceLog.find({ user: instructor?._id })
            .populate({
                path: "schedule",
                populate: { path: "room", populate: "building" },
            })
            .lean();
        console.log(logs);
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }
    return logs.map((log) => {
        const date = log.createdAt.toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
        });
        const time = log.createdAt.toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
        });
        return (
            <div
                key={log._id.toString()}
                className="bg-green-secondary text-text-primary border-green-tertiary relative my-3 grow rounded-md border-2 px-5 py-3 shadow-md"
            >
                <p>
                    Subject:{" "}
                    <span className="text-yellow-primary">
                        {log.schedule.subject}
                    </span>
                </p>
                <p>
                    Venue:{" "}
                    <span className="text-yellow-primary">
                        Venue: {log.schedule.room.building.name} -{" "}
                        {log.schedule.room.code}
                    </span>
                </p>
                <p>
                    Date: <span className="text-yellow-primary">{date}</span>
                </p>
                <p>
                    Time: <span className="text-yellow-primary">{time}</span>
                </p>
                <div className="absolute inset-y-0 left-0 flex -translate-x-1/2 flex-col justify-evenly">
                    <div className="bg-green-tertiary h-2 w-5 rounded-full" />
                    <div className="bg-green-tertiary h-2 w-5 rounded-full" />
                </div>
                <span className="absolute inset-y-0 right-3 flex items-center">
                    <History size={30} />
                </span>
            </div>
        );
    });
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
            <Logs />
        </Suspense>
    );
}
