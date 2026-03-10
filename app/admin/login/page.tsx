import { AdminAuth } from "../../actions/AdminAuth";
import AdminLoginForm from "./(components)/LoginForm";

export default function Page() {
    return (
        <section className="flex h-svh flex-col items-center justify-center gap-12">
            <AdminLoginForm action={AdminAuth} />
        </section>
    );
}
