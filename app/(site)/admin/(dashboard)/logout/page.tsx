"use client";
import { LogoutAdmin } from "@/app/actions/AdminAuthActions";
import Loading from "../../../loading";
import { useRouter } from "next/navigation";
import { adminLoginPage } from "@/constants";
import { useEffect } from "react";

export default function AdminLogoutPage() {
    const router = useRouter();

    useEffect(() => {
        LogoutAdmin().finally(() => {
            router.replace(adminLoginPage);
        });
    }, []);
    return <Loading />;
}
