"use client";

import { useAuth } from "@/app/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../(site)/loading";

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

    return user ? children : <Loading />;
}
