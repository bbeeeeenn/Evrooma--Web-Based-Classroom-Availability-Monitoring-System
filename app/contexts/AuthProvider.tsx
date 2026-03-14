"use client";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../(site)/loading";

// CONTEXTS ITSELF
const AuthContext = React.createContext<string | null>(null);
const AuthUpdateContext = React.createContext<(id: string | null) => void>(
    () => null,
);

// PROVIDER
export function AuthProvider({
    children,
    authAction,
}: Readonly<{
    children: React.ReactNode;
    authAction: () => Promise<string | null>;
}>) {
    const [user, setUser] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        authAction().then((user) => {
            setUser(user);
            setIsPending(false);
        });
    }, [authAction]);

    const updateUser = (id: string | null) => {
        setUser(id);
    };

    return (
        <>
            {isPending ? (
                <Loading />
            ) : (
                <AuthUpdateContext.Provider value={updateUser}>
                    <AuthContext.Provider value={user}>
                        {children}
                    </AuthContext.Provider>
                </AuthUpdateContext.Provider>
            )}
        </>
    );
}

// HOOKS
export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthUpdate() {
    return useContext(AuthUpdateContext);
}
