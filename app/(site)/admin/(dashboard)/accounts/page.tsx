import clsx from "clsx";
import { BookText, Plus } from "lucide-react";
import { adminAccountsPage, adminCreateAccountPage } from "@/constants";
import Link from "next/link";
import { Suspense } from "react";
import { Instructor, PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { connection } from "next/server";

function InstructorListSkeleton() {
    return (
        <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="block w-full space-y-2 rounded-md border-b-4 border-gray-200 bg-white px-5 py-5 opacity-70 shadow-md"
                >
                    <div className="h-8 max-w-2xs animate-pulse bg-gray-200"></div>
                    <div className="h-5 max-w-xs animate-pulse bg-gray-200"></div>
                </li>
            ))}
        </ul>
    );
}

async function InstructorsList() {
    let instructors: PlainInstructorDocument[] = [];
    try {
        await connection();
        await connectDB();
        instructors = await Instructor.find().lean({ virtuals: true });
    } catch (e) {
        console.error(e);
        return null;
    }

    return (
        <ul className="space-y-4">
            {instructors.map((instructor) => (
                <li key={instructor._id.toString()}>
                    <Link
                        href={`${adminAccountsPage}/${instructor._id}`}
                        className="block w-full rounded-md border-b-4 bg-white px-5 py-5 shadow-md"
                    >
                        <p className="flex items-center gap-1 text-2xl font-bold">
                            <BookText /> {instructor.fullName}
                        </p>
                        <p className="truncate font-semibold underline">
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
            <h1 className="flex items-center gap-2 text-4xl font-bold">
                Instructors
            </h1>
            <Link
                href={adminCreateAccountPage}
                className={clsx(
                    "mt-10 mb-5 flex w-fit cursor-pointer items-center gap-1 rounded-md bg-white p-2 font-semibold shadow-md",
                    "hover:bg-black-400 hover:text-black-100 transition-colors active:scale-105",
                )}
            >
                <Plus /> Add Instructor
            </Link>
            <Suspense fallback={<InstructorListSkeleton />}>
                <InstructorsList />
            </Suspense>
        </>
    );
}
