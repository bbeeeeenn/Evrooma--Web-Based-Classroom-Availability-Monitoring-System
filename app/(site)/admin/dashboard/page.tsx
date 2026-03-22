import { GetAdminInfo } from "@/app/actions/AdminAuthActions";
import { adminLoginPage } from "@/constants";
import { ShieldUser } from "lucide-react";
import { redirect } from "next/navigation";

async function Profile() {
    const admin = await GetAdminInfo();
    if (!admin) redirect(adminLoginPage);

    return (
        <div className="flex items-center gap-2">
            <ShieldUser size={45} />
            <div>
                <p className="font-semibold">Welcome,</p>
                <p className="text-2xl font-bold">{admin.fullName}</p>
            </div>
        </div>
    );
}

export default function AdminPage() {
    return <Profile />;
}
