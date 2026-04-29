"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { UserAuthSessionData, LoginFormActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { User, PlainUserDocument } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";
import { INSTRUCTOR_SESSION_SECRET } from "@/constants";

const studentSessionOptions: SessionOptions = {
    cookieName: "studentSession",
    password: INSTRUCTOR_SESSION_SECRET,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
    ttl: 60 * 60 * 24 * 7,
};

export async function StudentAuth(
    formData: FormData,
): Promise<LoginFormActionResponse> {
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();
    const rememberme = formData.get("rememberme") !== null;

    try {
        await connectDB();

        const user = await User.findOne({
            type: "student",
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

        const session = await getIronSession<UserAuthSessionData>(
            await cookies(),
            {
                ...studentSessionOptions,
                cookieOptions: {
                    ...studentSessionOptions.cookieOptions,
                    maxAge: rememberme ? 60 * 60 * 24 * 7 : undefined,
                },
            },
        );
        session.data = { userId: user._id.toString() };
        await session.save();
        return {
            status: "success",
            message: "",
            user: user._id.toString(),
            formData: new FormData(),
        };
    } catch (e) {
        console.error("[StudentAuth]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
            user: null,
            formData,
        };
    }
}

export async function GetStudentAuthInfo(): Promise<PlainUserDocument | null> {
    try {
        const session = await getIronSession<UserAuthSessionData>(
            await cookies(),
            studentSessionOptions,
        );
        await connectDB();
        const student = await User.findOne({
            _id: session.data?.userId,
            type: "student",
        }).lean<PlainUserDocument>({ virtuals: true });
        return student;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function LogoutStudent(): Promise<void> {
    const session = await getIronSession(
        await cookies(),
        studentSessionOptions,
    );
    session.destroy();
}
