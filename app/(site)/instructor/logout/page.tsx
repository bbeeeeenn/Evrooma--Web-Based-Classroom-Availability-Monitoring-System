"use client";
import Loading from "../../loading";
import { useRouter } from "next/navigation";
import { instructorLoginPage } from "@/constants";
import { LogoutInstructor } from "@/app/actions/InstructorAuthActions";
import { useEffect } from "react";

export default function AdminLogoutPage() {
    const router = useRouter();
    useEffect(() => {
        LogoutInstructor().finally(() => router.replace(instructorLoginPage));
    }, []);

    return <Loading />;
}
