"use client";
import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext<string | null>(null);
const AuthUpdateContext = React.createContext<(id: string | null) => void>(
    () => null,
);

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
                <div className="fixed inset-0 m-auto size-fit text-4xl font-bold">
                    Authenticating
                </div>
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

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthUpdate() {
    return useContext(AuthUpdateContext);
}
