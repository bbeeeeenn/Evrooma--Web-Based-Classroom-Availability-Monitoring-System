import { AuthenticateAdmin } from "@/app/actions/AdminAuthActions";
import LoginForm from "@/app/components/LoginForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import { adminRoomsPage } from "@/constants";

async function Login() {
    const user = await AuthenticateAdmin();
    if (user) {
        redirect(adminRoomsPage);
    }

    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="admin" />
        </section>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>
    );
}
