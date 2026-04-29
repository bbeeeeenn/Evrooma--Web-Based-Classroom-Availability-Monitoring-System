import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import { studentLoginPage } from "@/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";
import { StudentNavbar } from "./Navbar";

async function Authenticate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const student = await GetStudentAuthInfo();

    if (!student) {
        const pathname = (await headers()).get("x-pathname") ?? "";
        redirect(
            `${studentLoginPage}?redirect=${encodeURIComponent(pathname)}`,
        );
    }

    return (
        <>
            <StudentNavbar />
            <main className="font-inter m-auto max-w-5xl px-5 pt-3 pb-40">
                {children}
            </main>
        </>
    );
}

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<Loading />}>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
