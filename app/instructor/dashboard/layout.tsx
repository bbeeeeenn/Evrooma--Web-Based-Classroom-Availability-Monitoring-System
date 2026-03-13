import { AuthenticateAdmin } from "@/actions/AdminAuth";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const SuspendedComponent = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    if (!(await AuthenticateAdmin())) redirect(adminLoginPage);
    return <>{children}</>;
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={"Loading..."}>
            <SuspendedComponent>{children}</SuspendedComponent>
        </Suspense>
    );
}
