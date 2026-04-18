import { AuthenticateAdmin } from "@/app/actions/AdminAuthActions";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";
import { AdminNavBar } from "../ClientComponents";
import { Suspense } from "react";
import { headers } from "next/headers";

async function Authenticate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const admin = await AuthenticateAdmin();
    const pathname = (await headers()).get("x-pathname") ?? "";

    if (!admin) {
        redirect(`${adminLoginPage}?redirect=${encodeURIComponent(pathname)}`);
    }

    return (
        <>
            <AdminNavBar />
            <main className="font-inter has-[.accountform]:bg-green-secondary m-auto max-w-5xl px-5 pt-3 pb-40 sm:has-[.accountform]:bg-transparent">
                {children}
            </main>
        </>
    );
}

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
