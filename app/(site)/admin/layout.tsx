import { AuthenticateAdmin } from "@/app/actions/AdminActions";
import { AuthProvider } from "@/app/contexts/AuthProvider";
import React, { Suspense } from "react";
import Loading from "../loading";

const InitialAuthentication = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const initialUser = await AuthenticateAdmin();

    return (
        <AuthProvider initialUser={initialUser} authAction={AuthenticateAdmin}>
            {children}
        </AuthProvider>
    );
};

export default async function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<Loading text="Initializing..." />}>
            <InitialAuthentication>{children}</InitialAuthentication>
        </Suspense>
    );
}
