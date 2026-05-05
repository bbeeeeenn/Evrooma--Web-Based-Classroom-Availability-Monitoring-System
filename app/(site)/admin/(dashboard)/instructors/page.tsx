import clsx from "clsx";
import { BookText, Plus } from "lucide-react";
import { adminInstructorsPage, adminCreateInstructorPage } from "@/constants";
import Link from "next/link";
import { Suspense } from "react";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { connection } from "next/server";
import { UserListSkeleton } from "@/app/(site)/Components";

async function InstructorsList() {
    let instructors: PlainUserDocument[] = [];
    try {
        await connection();
        await connectDB();
        instructors = await User.find({ type: "instructor" }).lean({
            virtuals: true,
        });
    } catch (e) {
        console.error(e);
        return null;
    }

    return (
        <ul className="space-y-4">
            {instructors.map((instructor) => (
                <li key={instructor._id.toString()}>
                    <Link
                        href={`${adminInstructorsPage}/${instructor._id}`}
                        className={clsx(
                            "bg-green-secondary block w-full rounded-md px-5 py-5 text-green-50 shadow-md transition-all",
                            "hover:bg-green-tertiary active:bg-green-tertiary hover:scale-101 active:scale-100",
                        )}
                    >
                        <p className="flex items-center gap-2 text-xl font-bold">
                            <span>
                                <BookText />
                            </span>
                            {instructor.fullName}
                        </p>
                        <p className="truncate text-sm font-semibold">
                            {instructor.email}
                        </p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function AccountsPage() {
    return (
        <>
            <h1 className="text-text-primary flex items-center gap-2 text-2xl font-bold">
                Instructors
            </h1>
            <Link
                href={adminCreateInstructorPage}
                className={clsx(
                    "bg-yellow-primary my-5 flex w-fit cursor-pointer items-center gap-1 rounded-md p-2 text-sm font-semibold text-black shadow-md",
                    "hover:bg-yellow-secondary transition-colors active:scale-105",
                )}
            >
                <Plus /> Add Instructor
            </Link>
            <Suspense fallback={<UserListSkeleton />}>
                <InstructorsList />
            </Suspense>
        </>
    );
}
