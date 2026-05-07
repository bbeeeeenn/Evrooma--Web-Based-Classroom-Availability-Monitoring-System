// ####################################################################
// ####################################################################
// ########################                ############################
// ########################     UNUSED     ############################
// ########################                ############################
// ####################################################################
// ####################################################################

"use client";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../(site)/loading";

// CONTEXTS ITSELF
const AuthContext = React.createContext<string | null>(null);
const AuthUpdateContext = React.createContext<(id: string | null) => void>(
    () => null,
);

// PROVIDER

/**
 *
 * @deprecated
 */
export function AuthProvider({
    children,
    authAction,
    initialUser,
}: Readonly<{
    children: React.ReactNode;
    authAction: () => Promise<string | null>;
    initialUser?: string | null;
}>) {
    const [user, setUser] = useState<string | null>(initialUser ?? null);
    const [isPending, setIsPending] = useState(initialUser === undefined);

    useEffect(() => {
        if (initialUser !== undefined) {
            return;
        }

        authAction().then((user) => {
            setUser(user);
            setIsPending(false);
        });
    }, [authAction, initialUser]);

    const updateUser = (id: string | null) => {
        setUser(id);
    };

    return (
        <>
            {isPending ? (
                <Loading text="Authenticating..." />
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

/**
 *
 * @deprecated
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 *
 * @deprecated
 */
export function useAuthUpdate() {
    return useContext(AuthUpdateContext);
}
