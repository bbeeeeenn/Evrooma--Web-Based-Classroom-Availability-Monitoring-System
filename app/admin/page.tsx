import { AdminAuth, AuthenticateAdmin } from "@/actions/AdminAuth";
import AdminLoginForm from "./LoginForm";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { adminDashboardPage } from "@/constants";

const Suspended = async () => {
    if (await AuthenticateAdmin()) {
        redirect(adminDashboardPage);
    }

    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <AdminLoginForm action={AdminAuth} />
        </section>
    );
};

export default function AdminLoginPage() {
    return (
        <Suspense fallback={"Loading..."}>
            <Suspended />
        </Suspense>
    );
}
