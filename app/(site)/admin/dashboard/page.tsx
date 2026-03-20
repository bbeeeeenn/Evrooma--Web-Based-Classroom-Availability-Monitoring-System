import { GetAdminInfo } from "@/app/actions/AdminActions";
import { adminLoginPage } from "@/constants";
import { redirect } from "next/navigation";

async function Profile() {
    const admin = await GetAdminInfo();
    if (!admin) redirect(adminLoginPage);

    return <>{admin.fullName}</>;
}

export default function AdminPage() {
    return (
        <>
            <Profile />
        </>
    );
}
