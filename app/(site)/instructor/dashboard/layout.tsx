import { AuthenticateInstructor } from "@/app/actions/InstructorActions";
import CheckAuthentication from "@/app/components/CheckAuthentication";
import { instructorLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const Authenticate = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    if (!(await AuthenticateInstructor())) redirect(instructorLoginPage);
    return <>{children}</>;
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <CheckAuthentication fallbackRoute={instructorLoginPage}>
            {children}
        </CheckAuthentication>
    );
}
