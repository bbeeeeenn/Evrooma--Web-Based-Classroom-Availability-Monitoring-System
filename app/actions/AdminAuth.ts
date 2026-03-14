"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { LoginFormActionResponse, ServerActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { PlainUserDocument, User } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";

export type AdminAuthAction = (
    _: unknown,
    formData: FormData,
) => Promise<ServerActionResponse>;

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

interface AdminSessionData {
    data?: {
        userId: string;
    };
}

export async function AdminAuth(
    formData: FormData,
): Promise<LoginFormActionResponse> {
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();

    try {
        await connectDB();

        const user = await User.findOne({
            username: username,
            role: "admin",
        }).lean<PlainUserDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid username and password",
                user: null,
                formData,
            };
        }

        const session = await getIronSession<AdminSessionData>(
            await cookies(),
            adminSessionOptions,
        );
        session.data = { userId: user._id };
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

export async function AuthenticateAdmin(): Promise<string | null> {
    const session = await getIronSession<AdminSessionData>(
        await cookies(),
        adminSessionOptions,
    );

    return session.data?.userId ?? null;
}
