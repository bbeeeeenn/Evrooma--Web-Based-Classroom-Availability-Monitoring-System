import clsx from "clsx";
import { BookText, Plus, SquareUserRound, UserRound } from "lucide-react";
import { BackButton } from "../ClientComponents";
import {
    adminAccountsPage,
    adminCreateAccountPage,
    adminDashboardPage,
} from "@/constants";
import Link from "next/link";
import { Suspense } from "react";
import { Instructor, PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { connectDB } from "@/app/mongoDb/mongodb";
import { connection } from "next/server";

async function InstructorsList() {
    await new Promise((res) => setTimeout(res, 3000));
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
                        <p className="font-semibold underline">
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
            <BackButton dest={adminDashboardPage} />
            <h1 className="flex items-center gap-2 text-4xl font-bold">
                Instructors
            </h1>
            <Link
                href={adminCreateAccountPage}
                className={clsx(
                    "my-10 flex w-fit cursor-pointer items-center gap-1 rounded-md bg-white p-2 font-semibold shadow-md",
                    "hover:bg-black-400 hover:text-black-100 transition-colors active:scale-105",
                )}
            >
                <Plus /> Add Instructor
            </Link>
            <Suspense fallback="Loading...">
                <InstructorsList />
            </Suspense>
        </>
    );
}
