import { getIronSession, SessionOptions } from "iron-session";
import { ServerActionResponse } from "./_";
import { connectDB } from "@/mongoDb/mongodb";
import { PlainUserDocument, User } from "@/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/lib/bcrypt";

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
};

interface AdminSessionData {
    data?: {
        userId: string;
    };
}

export async function AdminAuth(
    formData: FormData,
): Promise<ServerActionResponse> {
    "use server";
    await new Promise((res) => setTimeout(res, 1000));
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();

    console.log(formData);
    // await connectDB();
    // await User.create({
    //     username: "evrooma",
    //     password: await encrypt("123123"),
    //     firstName: "Evrooma",
    //     lastName: "Admin",
    // });
    // return {
    //     formData,
    //     status: "success",
    //     message: "",
    // };

    try {
        await connectDB();

        const user = await User.findOne({
            username: username,
        }).lean<PlainUserDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid username and password",
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
        };
    } catch (e) {
        return {
            status: "error",
            message: e instanceof Error ? e.message : "Unknown Error",
        };
    }
}

export async function AuthenticateAdmin(): Promise<boolean> {
    const session = await getIronSession<AdminSessionData>(
        await cookies(),
        adminSessionOptions,
    );

    return !!session.data;
}
