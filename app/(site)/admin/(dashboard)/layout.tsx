import { AuthenticateAdmin } from "@/app/actions/AdminAuthActions";
import {
    adminAccountsPage,
    adminLoginPage,
    adminLogoutPage,
    adminRoomsPage,
} from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";
import { CoolSidebar } from "@/app/components/CoolSidebar";
import { DoorClosed, LogOut, UsersRound } from "lucide-react";

async function Authenticate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const admin = await AuthenticateAdmin();
    const pathname = (await headers()).get("x-pathname") ?? "";

    if (!admin) {
        redirect(`${adminLoginPage}?redirect=${encodeURIComponent(pathname)}`);
    }

    return (
        <CoolSidebar
            items={[
                {
                    icon: <DoorClosed size={30} />,
                    text: "Rooms",
                    href: adminRoomsPage,
                },
                {
                    icon: <UsersRound size={30} />,
                    text: "Accounts",
                    href: adminAccountsPage,
                },
                {
                    icon: <LogOut size={30} />,
                    text: "Logout",
                    href: adminLogoutPage,
                },
            ]}
        >
            {children}
        </CoolSidebar>
    );
}

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
