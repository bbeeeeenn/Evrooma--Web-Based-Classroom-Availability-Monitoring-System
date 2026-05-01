import { Suspense } from "react";
import Loading from "../../loading";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { redirect } from "next/navigation";
import { studentLoginPage } from "@/constants";
import { GraduationCap } from "lucide-react";
import { Divider } from "@/app/components/Divider";

async function Profile() {
    const student = await GetStudentAuthInfo();
    if (!student) redirect(studentLoginPage);

    return (
        <div className="text-text-primary flex items-center gap-2">
            <GraduationCap size={45} />
            <div>
                <p className="text-text-secondary font-semibold">Welcome,</p>
                <p className="text-2xl font-bold">{student.fullName}</p>
            </div>
        </div>
    );
}

export default function InstructorPage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Profile />
                <Divider text="Classes attended" />
            </Suspense>
        </>
    );
}
