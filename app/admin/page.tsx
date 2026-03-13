import { AdminAuth, AuthenticateAdmin } from "@/actions/AdminAuth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { adminDashboardPage } from "@/constants";
import LoginForm from "@/components/LoginForm";

const Authenticate = async () => {
    if (await AuthenticateAdmin()) {
        redirect(adminDashboardPage);
    }

    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="admin" action={AdminAuth} />
        </section>
    );
};

export default function AdminLoginPage() {
    return (
        <Suspense fallback={"Loading..."}>
            <Authenticate />
        </Suspense>
    );
}
