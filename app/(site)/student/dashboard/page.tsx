import { Suspense } from "react";
import Loading from "../../loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { redirect } from "next/navigation";
import { studentLoginPage } from "@/constants";
import { GraduationCap, Settings2 } from "lucide-react";
import Link from "next/link";

async function Profile() {
    const student = await GetStudentAuthInfo();
    if (!student) redirect(studentLoginPage);

    return (
        <div className="flex items-end justify-between gap-5">
            <div className="text-text-primary flex items-center gap-2">
                <GraduationCap size={45} />
                <div>
                    <p className="text-text-secondary font-semibold">
                        Welcome,
                    </p>
                    <p className="text-2xl font-bold">{student.fullName}</p>
                </div>
            </div>
            <Link
                href={""}
                className="bg-yellow-primary focus-visible:bg-yellow-secondary active:bg-yellow-secondary hover:bg-yellow-secondary font-poppins flex items-center justify-center gap-2 rounded-md p-2 px-3 text-sm font-semibold text-black shadow-md"
            >
                <Settings2 size={20} />{" "}
                <span className="hidden sm:inline">Settings</span>
            </Link>
        </div>
    );
}

export default function InstructorPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Profile />
            </Suspense>
        </>
    );
}
