"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { UserAuthSessionData, LoginFormActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";
import { INSTRUCTOR_SESSION_SECRET } from "@/constants";

const instructorSessionOptions: SessionOptions = {
    cookieName: "instructorSession",
    password: INSTRUCTOR_SESSION_SECRET,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
    ttl: 60 * 60 * 24 * 7,
};

export async function AuthenticateInstructor(
    userId: string,
    rememberme: boolean,
) {
    const session = await getIronSession<UserAuthSessionData>(await cookies(), {
        ...instructorSessionOptions,
        cookieOptions: {
            ...instructorSessionOptions.cookieOptions,
            maxAge: rememberme ? 60 * 60 * 24 * 7 : undefined,
        },
    });
    session.data = { userId };
    await session.save();
}

export async function InstructorAuth(
    formData: FormData,
): Promise<LoginFormActionResponse> {
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();
    const rememberme = formData.get("rememberme") !== null;

    try {
        await connectDB();

        const user = await User.findOne({
            type: "instructor",
            email,
        }).lean<PlainUserDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid email and password",
                user: null,
                formData,
            };
        }

        await AuthenticateInstructor(user._id.toString(), rememberme);

        return {
            status: "success",
            message: "",
            user: user._id.toString(),
            formData: new FormData(),
        };
    } catch (e) {
        console.error("[InstructorAuth]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
            user: null,
            formData,
        };
    }
}

export async function GetInstructorAuthInfo(): Promise<PlainUserDocument | null> {
    try {
        const session = await getIronSession<UserAuthSessionData>(
            await cookies(),
            instructorSessionOptions,
        );
        await connectDB();
        const instructor = await User.findOne({
            _id: session.data?.userId,
            type: "instructor",
        }).lean<PlainUserDocument>({ virtuals: true });
        return instructor;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function LogoutInstructor(): Promise<void> {
    const session = await getIronSession(
        await cookies(),
        instructorSessionOptions,
    );
    session.destroy();
}
