import CheckAuthentication from "@/app/components/CheckAuthentication";
import { adminLoginPage } from "@/constants";
import { AdminNavBar } from "./AdminNavBar";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <CheckAuthentication fallbackRoute={adminLoginPage}>
            <AdminNavBar>{children}</AdminNavBar>
        </CheckAuthentication>
    );
}
