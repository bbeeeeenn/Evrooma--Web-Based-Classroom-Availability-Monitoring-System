import AdminLogout from "./_";
import { AuthenticateAdmin, LogoutAdmin } from "@/app/actions/AdminActions";
import Loading from "../../loading";
import { redirect } from "next/navigation";
import { adminLoginPage } from "@/constants";

export default async function AdminLogoutPage() {
    if (!(await AuthenticateAdmin())) {
        redirect(adminLoginPage);
    }

    return (
        <div className="fixed inset-0 m-auto flex size-fit items-center gap-2 text-3xl font-bold">
            <AdminLogout action={LogoutAdmin} />
            <Loading text="Logging Out..." />
        </div>
    );
}
