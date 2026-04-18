import { AuthenticateAdmin } from "@/app/actions/AdminAuthActions";
import LoginForm from "@/app/components/LoginForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";
import { adminRoomsPage } from "@/constants";

async function Login({ redirectPath }: { redirectPath?: string }) {
    const user = await AuthenticateAdmin();
    if (user) {
        redirect(redirectPath || adminRoomsPage);
    }
    return (
        <section className="sm:bg-green-primary bg-green-secondary flex h-svh min-h-161.75 flex-col items-center justify-center">
            <LoginForm formType="admin" redirectPath={redirectPath} />
        </section>
    );
}

export default async function AdminLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string }>;
}) {
    const params = await searchParams;
    return (
        <Suspense fallback={<Loading />}>
            <Login redirectPath={params.redirect} />
        </Suspense>
    );
}
