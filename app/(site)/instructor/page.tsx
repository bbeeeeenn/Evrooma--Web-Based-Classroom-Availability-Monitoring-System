import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import LoginForm from "@/app/components/LoginForm";
import { instructorHomePage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

async function Login({ params }: { params: Promise<{ redirect?: string }> }) {
    const { redirect: redirectPath } = await params;

    const instructor = await GetInstructorAuthInfo();

    if (instructor) {
        redirect(redirectPath ?? instructorHomePage);
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
    return (
        <Suspense fallback={<Loading />}>
            <Login params={searchParams} />
        </Suspense>
    );
}
