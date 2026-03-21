import { AuthenticateInstructor } from "@/app/actions/InstructorAuthActions";
import LoginForm from "@/app/components/LoginForm";
import { instructorDashboardPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

async function Login() {
    const instructor = await AuthenticateInstructor();
    if (instructor) {
        redirect(instructorDashboardPage);
    }

    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="instructor" />
        </section>
    );
}

export default async function InstructorLoginPage() {
    return (
        <Suspense>
            <Login />
        </Suspense>
    );
}
