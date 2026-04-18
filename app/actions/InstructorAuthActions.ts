"use server";
import { getIronSession, SessionOptions } from "iron-session";
import { AuthSessionData, LoginFormActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Instructor, PlainInstructorDocument } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";

const instructorSessionOptions: SessionOptions = {
    cookieName: "instructorSession",
    password: process.env.INSTRUCTOR_SESSION_SECRET!,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
    ttl: 60 * 60 * 24 * 7,
};

export async function InstructorAuth(
    formData: FormData,
): Promise<LoginFormActionResponse> {
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();
    const rememberme = formData.get("rememberme") !== null;

    try {
        await connectDB();

        const user = await Instructor.findOne({
            email,
        }).lean<PlainInstructorDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid email and password",
                user: null,
                formData,
            };
        }

        const session = await getIronSession<AuthSessionData>(await cookies(), {
            ...instructorSessionOptions,
            cookieOptions: {
                ...instructorSessionOptions.cookieOptions,
                maxAge: rememberme ? 60 * 60 * 24 * 7 : undefined,
            },
        });
        session.data = { userId: user._id.toString() };
        await session.save();
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

export async function GetInstructorAuthInfo(): Promise<PlainInstructorDocument | null> {
    try {
        const session = await getIronSession<AuthSessionData>(
            await cookies(),
            instructorSessionOptions,
        );
        await connectDB();
        const instructor = await Instructor.findById(
            session.data?.userId,
        ).lean<PlainInstructorDocument>({ virtuals: true });
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
