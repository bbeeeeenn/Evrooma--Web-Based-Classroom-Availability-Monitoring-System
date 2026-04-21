"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { AdminAuthSessionData, LoginFormActionResponse } from "./_";
import { cookies } from "next/headers";
import {
    ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET,
    ADMIN_USERNAME,
} from "@/constants";

const adminSessionOptions: SessionOptions = {
    cookieName: "adminSession",
    password: ADMIN_SESSION_SECRET,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
    ttl: 60 * 60 * 24 * 7,
};

export async function AdminAuth(
    formData: FormData,
): Promise<LoginFormActionResponse> {
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();
    const rememberme = formData.get("rememberme") !== null;

    try {
        const adminUsername = ADMIN_USERNAME;
        const adminPassword = ADMIN_PASSWORD;
        if (username !== adminUsername || password !== adminPassword) {
            return {
                status: "error",
                message: "Invalid username and password",
                user: null,
                formData,
            };
        }

        const session = await getIronSession<AdminAuthSessionData>(
            await cookies(),
            {
                ...adminSessionOptions,
                cookieOptions: {
                    ...adminSessionOptions.cookieOptions,
                    maxAge: rememberme ? 60 * 60 * 24 * 7 : undefined,
                },
            },
        );
        session.data = { username: adminUsername, password: adminPassword };
        await session.save();
        return {
            status: "success",
            message: "",
            formData: new FormData(),
            user: adminUsername,
        };
    } catch (e) {
        console.error("[AdminAuth]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
            user: null,
            formData,
        };
    }
}

// This should be deprecated, but.. nah
export async function AuthenticateAdmin(): Promise<{
    username: string;
    password: string;
} | null> {
    const adminInfo = await GetAdminAuthInfo();

    return adminInfo;
}

export async function GetAdminAuthInfo(): Promise<{
    username: string;
    password: string;
} | null> {
    try {
        const session = await getIronSession<AdminAuthSessionData>(
            await cookies(),
            adminSessionOptions,
        );
        return session.data ?? null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function LogoutAdmin(): Promise<void> {
    const session = await getIronSession(await cookies(), adminSessionOptions);
    session.destroy();
}
