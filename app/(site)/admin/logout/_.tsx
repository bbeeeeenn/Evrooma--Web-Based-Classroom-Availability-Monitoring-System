"use client";

import { useAuthUpdate } from "@/app/contexts/AuthProvider";
import { adminDashboardPage, adminLoginPage } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLogout({
    action,
}: Readonly<{ action: () => Promise<void> }>) {
    const router = useRouter();
    const updateUser = useAuthUpdate();

    useEffect(() => {
        action()
            .then(() => {
                updateUser(null);
                router.replace(adminLoginPage);
            })
            .catch(() => {
                router.replace(adminDashboardPage);
            });
    }, [action, updateUser, router]);

    return <></>;
}
