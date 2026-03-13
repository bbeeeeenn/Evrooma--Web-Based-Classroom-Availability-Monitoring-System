import { AuthenticateInstructor } from "@/actions/InstructorAuth";
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
        <Suspense fallback={"Loading..."}>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
