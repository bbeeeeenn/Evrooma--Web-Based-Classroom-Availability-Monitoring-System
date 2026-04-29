import { GetInstructorAuthInfo } from "@/app/actions/InstructorAuthActions";
import {
    instructorDashboardPage,
    instructorLoginPage,
    instructorLogoutPage,
    instructorRoomsPage,
    instructorSchedulesPage,
} from "@/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";
import Loading from "../../loading";
import { CoolSidebar } from "@/app/components/CoolSidebar";
import { CalendarCheck, DoorClosed, Home, LogOut } from "lucide-react";

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
                    text: "Dashboard",
                    href: instructorDashboardPage,
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
