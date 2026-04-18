"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { AuthSessionData, LoginFormActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Admin, PlainAdminDocument } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";

const adminSessionOptions: SessionOptions = {
    cookieName: "adminSession",
    password: process.env.ADMIN_SESSION_SECRET!,
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
        await connectDB();
        const user = await Admin.findOne({
            username: username,
        }).lean<PlainAdminDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid username and password",
                user: null,
                formData,
            };
        }

        const session = await getIronSession<AuthSessionData>(await cookies(), {
            ...adminSessionOptions,
            cookieOptions: {
                ...adminSessionOptions.cookieOptions,
                maxAge: rememberme ? 60 * 60 * 24 * 7 : undefined,
            },
        });
        session.data = { userId: user._id.toString() };
        await session.save();
        return {
            status: "success",
            message: "",
            formData: new FormData(),
            user: user._id.toString(),
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

/**
 *
 * @deprecated Use `GetAdminAuthInfo` instead.
 */
export async function AuthenticateAdmin(): Promise<string | null> {
    const adminInfo = await GetAdminAuthInfo();

    return adminInfo?._id.toString() ?? null;
}

export async function GetAdminAuthInfo(): Promise<PlainAdminDocument | null> {
    try {
        const session = await getIronSession<AuthSessionData>(
            await cookies(),
            adminSessionOptions,
        );
        await connectDB();
        const admin = await Admin.findById(
            session.data?.userId,
        ).lean<PlainAdminDocument>({ virtuals: true });
        return admin;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function LogoutAdmin(): Promise<void> {
    const session = await getIronSession(await cookies(), adminSessionOptions);
    session.destroy();
}
