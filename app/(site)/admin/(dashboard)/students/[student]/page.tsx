import { adminStudentsPage } from "@/constants";
import { BackButton } from "@/app/components/BackButton";
import { StudentInfoComponent } from "./ClientComponents";
import ErrorFallback from "@/app/components/ErrorFallback";
import {
    AttendanceLog,
    PopulatedPlainLogDocument,
} from "@/app/mongoDb/models/log";
import { connectDB } from "@/app/mongoDb/mongodb";
import { PlainUserDocument, User } from "@/app/mongoDb/models/user";
import { Divider } from "@/app/components/Divider";
import { LogCard } from "@/app/(site)/Components";

async function Logs({ studentId }: { studentId: string }) {
    let logs: PopulatedPlainLogDocument[];
    let student: PlainUserDocument;
    try {
        await connectDB();
        student = await User.findById(studentId).lean({ virtuals: true });

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

    return (
        <>
            {logs.map((log) => (
                <LogCard key={log._id.toString()} log={log} />
            ))}
        </>
    );
}

export default async function InstructorInfoPage({
    params,
}: {
    params: Promise<{ student: string }>;
}) {
    const { student } = await params;
    return (
        <>
            <BackButton dest={adminStudentsPage} />
            <StudentInfoComponent />
            <Divider text="History" />
            <Logs studentId={student} />
        </>
    );
}
