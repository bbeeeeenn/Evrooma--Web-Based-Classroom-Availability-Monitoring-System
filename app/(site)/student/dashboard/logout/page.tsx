"use client";

import Loading from "@/app/(site)/loading";
import { LogoutStudent } from "@/app/actions/StudentAuthActions";
import { studentLoginPage } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLogoutPage() {
    const router = useRouter();
    useEffect(() => {
        LogoutStudent().finally(() => router.replace(studentLoginPage));
    }, []);

    return <Loading />;
}
