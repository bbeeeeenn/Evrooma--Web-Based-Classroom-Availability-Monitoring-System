import { getIronSession, SessionOptions } from "iron-session";
import {
    AuthSessionData,
    LoginFormActionResponse,
    ServerActionResponse,
} from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Instructor, PlainUserDocument } from "@/app/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/app/lib/bcrypt";

export type InstructorAuthAction = (
    _: unknown,
    formData: FormData,
) => Promise<ServerActionResponse>;

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
    "use server";
    const username = (formData.get("username") as string).trim();
    const password = (formData.get("password") as string).trim();

    try {
        await connectDB();

        const user = await Instructor.findOne({
            username: username,
        }).lean<PlainUserDocument>();

        if (!user || !(await compare(password, user.password))) {
            return {
                status: "error",
                message: "Invalid username and password",
                user: null,
                formData,
            };
        }

        const session = await getIronSession<AuthSessionData>(
            await cookies(),
            instructorSessionOptions,
        );
        session.data = { userId: user._id };
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

export async function AuthenticateInstructor(): Promise<string | null> {
    "use server";
    const session = await getIronSession<AuthSessionData>(
        await cookies(),
        instructorSessionOptions,
    );

    return session.data?.userId ?? null;
}

export async function LogoutInstructor(): Promise<void> {
    "use server";
    const session = await getIronSession(
        await cookies(),
        instructorSessionOptions,
    );
    session.destroy();
}
