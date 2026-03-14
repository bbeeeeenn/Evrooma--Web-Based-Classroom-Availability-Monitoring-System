import CheckAuthentication from "@/app/components/CheckAuthentication";
import { adminLoginPage } from "@/constants";

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <CheckAuthentication fallbackRoute={adminLoginPage}>
            {children}
        </CheckAuthentication>
    );
}
