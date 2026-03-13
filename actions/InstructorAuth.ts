import { getIronSession, SessionOptions } from "iron-session";
import { ServerActionResponse } from "./_";
import { connectDB } from "@/mongoDb/mongodb";
import { PlainUserDocument, User } from "@/mongoDb/models/user";
import { cookies } from "next/headers";
import { compare } from "@/lib/bcrypt";

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
};

interface InstructorSessionData {
    data?: {
        userId: string;
    };
}

export async function InstructorAuth(
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
    //     lastName: "Instructor",
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

        const session = await getIronSession<InstructorSessionData>(
            await cookies(),
            instructorSessionOptions,
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

export async function AuthenticateInstructor(): Promise<boolean> {
    const session = await getIronSession<InstructorSessionData>(
        await cookies(),
        instructorSessionOptions,
    );

    return !!session.data;
}
