import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import { instructorLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { InstructorNavBar } from "./ClientComponents";
import { Suspense } from "react";
import { headers } from "next/headers";

async function Authenticate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const instructor = await GetInstructorAuthInfo();
    const pathname = (await headers()).get("x-pathname") ?? "";

    if (!instructor) {
        redirect(
            `${instructorLoginPage}?redirect=${encodeURIComponent(pathname)}`,
        );
    }

    return (
        <>
            <InstructorNavBar />
            <main className="font-inter m-auto max-w-5xl p-3 px-5">
                {children}
            </main>
        </>
    );
}

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
