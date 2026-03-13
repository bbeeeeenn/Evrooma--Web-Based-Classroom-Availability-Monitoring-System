import {
    AuthenticateInstructor,
    InstructorAuth,
} from "@/actions/InstructorAuth";
import { redirect } from "next/navigation";
import { instructorDashboardPage } from "@/constants";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

const Authenticate = async () => {
    if (await AuthenticateInstructor()) redirect(instructorDashboardPage);

    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="instructor" action={InstructorAuth} />
        </section>
    );
};

export default function InstructorLoginPage() {
    return (
        <Suspense fallback={"Loading..."}>
            <Authenticate />
        </Suspense>
    );
}
