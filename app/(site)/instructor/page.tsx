import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import LoginForm from "@/app/components/LoginForm";
import { instructorDashboardPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

async function Login({ redirectPath }: { redirectPath?: string }) {
    const instructor = await GetInstructorAuthInfo();
    if (instructor) {
        redirect(redirectPath ?? instructorDashboardPage);
    }

    return (
        <section className="sm:bg-green-primary bg-green-secondary flex h-svh min-h-161.75 flex-col items-center justify-center">
            <LoginForm formType="instructor" redirectPath={redirectPath} />
        </section>
    );
}

export default async function InstructorLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string }>;
}) {
    const params = await searchParams;
    return (
        <Suspense fallback={<Loading />}>
            <Login redirectPath={params.redirect} />
        </Suspense>
    );
}
