import Loading from "@/app/(site)/loading";
import ErrorFallback from "@/app/components/ErrorFallback";
import { UserInfoProvider } from "@/app/contexts/UserInfoProvider";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminStudentsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function VerifyStudent({
    children,
    studentId,
}: Readonly<{
    children: React.ReactNode;
    studentId: string;
}>) {
    if (!isValidObjectId(studentId)) redirect(adminStudentsPage);
    let student: PlainUserDocument;

    try {
        await connectDB();
        student = await User.findOne({
            _id: studentId,
            type: "student",
        }).lean({
            virtuals: true,
        });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    if (!student) {
        redirect(adminStudentsPage);
    }
    return (
        <UserInfoProvider
            data={{
                userId: student._id.toString(),
                email: student.email,
                fname: student.firstName,
                lname: student.lastName,
                createdAt: student.createdAt,
            }}
        >
            {children}
        </UserInfoProvider>
    );
}

export default async function InstructorAccountLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ student: string }>;
}>) {
    const { student } = await params;
    return (
        <Suspense fallback={<Loading />}>
            <VerifyStudent studentId={student}>{children}</VerifyStudent>
        </Suspense>
    );
}
