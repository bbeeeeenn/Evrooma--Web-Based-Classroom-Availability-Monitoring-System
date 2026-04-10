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
        <section className="sm:bg-landing-green-primary bg-green-tertiary flex h-svh min-h-161.75 flex-col items-center justify-center">
            <LoginForm formType="instructor" />
        </section>
    );
}

export default async function InstructorLoginPage() {
    return (
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>
    );
}
