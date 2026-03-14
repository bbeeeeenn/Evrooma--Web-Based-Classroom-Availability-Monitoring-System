import { AdminAuth } from "@/app/actions/AdminAuth";
import LoginForm from "@/app/components/LoginForm";

export default function AdminLoginPage() {
    return (
        <section className="flex h-svh flex-col items-center justify-center bg-white sm:bg-transparent">
            <LoginForm formType="admin" action={AdminAuth} />
        </section>
    );
}
