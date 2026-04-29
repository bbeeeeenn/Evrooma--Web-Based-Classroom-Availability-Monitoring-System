import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";
import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { studentDashboardPage } from "@/constants";

async function Login({ redirectPath }: { redirectPath?: string }) {
    const student = await GetStudentAuthInfo();
    if (student) {
        redirect(redirectPath ?? studentDashboardPage);
    }

    return (
        <section className="sm:bg-green-primary bg-green-secondary flex min-h-161.75 flex-col items-center pt-10 pb-30">
            <LoginForm formType="student" redirectPath={redirectPath} />
        </section>
    );
}

export default async function StudentLoginPage({
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
