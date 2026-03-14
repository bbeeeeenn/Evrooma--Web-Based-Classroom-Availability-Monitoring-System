"use client";

import { useAuth } from "@/app/context_providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckAuthentication({
    children,
    fallbackRoute,
}: Readonly<{ children: React.ReactNode; fallbackRoute: string }>) {
    const router = useRouter();
    const user = useAuth();

    useEffect(() => {
        if (!user) {
            router.replace(fallbackRoute);
        }
    }, [router, user, fallbackRoute]);
    return <>{children}</>;
}
