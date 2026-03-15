import { AuthenticateAdmin } from "@/app/actions/AdminActions";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { AdminNavBar } from "./AdminNavBar";
import { Suspense } from "react";
import Loading from "../../loading";

const Suspended = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const user = await AuthenticateAdmin();

    if (!user) {
        redirect(adminLoginPage);
    }

    return (
        <>
            <AdminNavBar />
            {children}
        </>
    );
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<Loading text="Initializing..." />}>
            <Suspended>{children}</Suspended>
        </Suspense>
    );
}
