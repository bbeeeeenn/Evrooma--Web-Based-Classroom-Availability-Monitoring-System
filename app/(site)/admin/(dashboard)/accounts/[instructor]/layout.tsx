import Loading from "@/app/(site)/loading";
import { InstructorInfoProvider } from "@/app/contexts/InstructorProvider";
import { Instructor, PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { adminAccountsPage } from "@/constants";
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
    if (!isValidObjectId(instructorId)) redirect(adminAccountsPage);
    let instructor: PlainInstructorDocument;
    try {
        await connectDB();
        instructor = await Instructor.findById(instructorId).lean({
            virtuals: true,
        });
        if (!instructor) {
            redirect(adminAccountsPage);
        }
    } catch (e) {
        if (!(e instanceof Error) || e.message !== "NEXT_REDIRECT")
            console.error(e);
        redirect(adminAccountsPage);
    }
    return (
        <InstructorInfoProvider
            data={{
                instructorId: instructor._id.toString(),
                email: instructor.email,
                fname: instructor.firstName,
                lname: instructor.lastName,
            }}
        >
            {children}
        </InstructorInfoProvider>
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
