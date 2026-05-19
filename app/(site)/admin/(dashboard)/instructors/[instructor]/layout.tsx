import Loading from "@/app/(site)/loading";
import ErrorFallback from "@/app/components/ErrorFallback";
import { UserInfoProvider } from "@/app/contexts/UserInfoProvider";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminInstructorsPage } from "@/constants";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function VerifyInstructor({
    children,
    instructorId,
}: Readonly<{
    children: React.ReactNode;
    instructorId: string;
}>) {
    if (!isValidObjectId(instructorId)) redirect(adminInstructorsPage);
    let instructor: PlainUserDocument;

    try {
        await connectDB();
        instructor = await User.findOne({
            _id: instructorId,
            type: "instructor",
        }).lean({
            virtuals: true,
        });
    } catch (e) {
        console.error(e);
        return <ErrorFallback error={e} />;
    }

    if (!instructor) {
        redirect(adminInstructorsPage);
    }
    return (
        <UserInfoProvider
            data={{
                userId: instructor._id.toString(),
                email: instructor.email,
                fname: instructor.firstName,
                lname: instructor.lastName,
                createdAt: instructor.createdAt,
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
    params: Promise<{ instructor: string }>;
}>) {
    const { instructor } = await params;
    return (
        <Suspense fallback={<Loading />}>
            <VerifyInstructor instructorId={instructor}>
                {children}
            </VerifyInstructor>
        </Suspense>
    );
}
