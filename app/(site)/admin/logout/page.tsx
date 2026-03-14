import { LoaderCircle } from "lucide-react";
import AdminLogout from "./_";
import { LogoutAdmin } from "@/app/actions/AdminActions";
import CheckAuthentication from "@/app/components/CheckAuthentication";
import { adminLoginPage } from "@/constants";

export default function AdminLogoutPage() {
    return (
        <CheckAuthentication fallbackRoute={adminLoginPage}>
            <div className="fixed inset-0 m-auto flex size-fit items-center gap-2 text-3xl font-bold">
                <AdminLogout action={LogoutAdmin} />
                <LoaderCircle className="animate-spin" size={30} /> Logging Out
            </div>
        </CheckAuthentication>
    );
}
