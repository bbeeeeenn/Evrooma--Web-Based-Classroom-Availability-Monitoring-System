import { GetStudentAuthInfo } from "@/app/actions/StudentAuthActions";
import {
    studentHomePage,
    studentLoginPage,
    studentLogoutPage,
    studentLogsPage,
    studentRoomsPage,
    studentScanPage,
    studentSettingsPage,
} from "@/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";
import { CoolSidebar } from "@/app/components/CoolSidebar";
import {
    DoorClosed,
    Home,
    LogOut,
    Logs,
    ScanLine,
    Settings2,
} from "lucide-react";

async function Authenticate({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const student = await GetStudentAuthInfo();

    if (!student) {
        const pathname = (await headers()).get("x-pathname") ?? "";
        redirect(
            `${studentLoginPage}?redirect=${encodeURIComponent(pathname)}`,
        );
    }

    return (
        <CoolSidebar
            items={[
                {
                    icon: <Home size={30} />,
                    text: "Home",
                    href: studentHomePage,
                },
                {
                    icon: <DoorClosed size={30} />,
                    text: "Rooms",
                    href: studentRoomsPage,
                },
                {
                    icon: <Logs size={30} />,
                    text: "My Logs",
                    href: studentLogsPage,
                },
                {
                    icon: <ScanLine size={30} />,
                    text: "Scanner",
                    href: studentScanPage,
                },
                {
                    icon: <Settings2 size={30} />,
                    text: "Account",
                    href: studentSettingsPage,
                    pushdown: true,
                },
                {
                    icon: <LogOut size={30} />,
                    text: "Logout",
                    href: studentLogoutPage,
                },
            ]}
        >
            {children}
        </CoolSidebar>
    );
}

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<Loading />}>
            <Authenticate>{children}</Authenticate>
        </Suspense>
    );
}
