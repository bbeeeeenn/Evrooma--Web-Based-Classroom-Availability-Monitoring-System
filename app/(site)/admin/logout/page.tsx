import { LoaderCircle } from "lucide-react";
import AdminLogout from "./_";
import { LogoutAdmin } from "@/app/actions/AdminActions";

export default function AdminLogoutPage() {
    return (
        <div className="fixed inset-0 m-auto flex size-fit items-center gap-2 text-3xl font-bold">
            <AdminLogout action={LogoutAdmin} />
            <LoaderCircle className="animate-spin" size={30} /> Logging Out
        </div>
    );
}
