import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import {
    instructorHomePage,
    instructorLoginPage,
    instructorLogoutPage,
    instructorLogsPage,
    instructorRoomsPage,
    instructorScanPage,
    instructorSchedulesPage,
    instructorSettingsPage,
} from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";
import Loading from "../../loading";
import { CoolSidebar } from "@/app/components/CoolSidebar";
import {
    CalendarCheck,
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
    const instructor = await GetInstructorAuthInfo();
    if (!instructor) {
        const pathname = (await headers()).get("x-pathname") ?? "";
        redirect(
            `${instructorLoginPage}?redirect=${encodeURIComponent(pathname)}`,
        );
    }

    return (
        <CoolSidebar
            items={[
                {
                    icon: <Home size={30} />,
                    text: "Home",
                    href: instructorHomePage,
                },
                {
                    icon: <DoorClosed size={30} />,
                    text: "Rooms",
                    href: instructorRoomsPage,
                },
                {
                    icon: <CalendarCheck size={30} />,
                    text: "My Schedules",
                    href: instructorSchedulesPage,
                },
                {
                    icon: <Logs size={30} />,
                    text: "My Logs",
                    href: instructorLogsPage,
                },
                {
                    icon: <ScanLine size={30} />,
                    text: "Scanner",
                    href: instructorScanPage,
                },
                {
                    icon: <Settings2 size={30} />,
                    text: "Account",
                    href: instructorSettingsPage,
                    pushdown: true,
                },
                {
                    icon: <LogOut size={30} />,
                    text: "Logout",
                    href: instructorLogoutPage,
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
