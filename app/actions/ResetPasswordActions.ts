"use server";
import { Resend } from "resend";
import { generateToken } from "../lib/crypto";
import { ResetToken } from "../mongoDb/models/resettoken";
import { User } from "../mongoDb/models/user";
import { connectDB } from "../mongoDb/mongodb";
import { ServerActionResponse } from "./_";
import { RESEND_API_KEY, resetPasswordPage } from "@/constants";
import ResetPasswordEmail from "../emails/ResetPassword";
import { headers } from "next/headers";
import { AuthenticateStudent } from "./StudentAuthActions";
import { encrypt } from "../lib/bcrypt";
import { AuthenticateInstructor } from "./InstructorAuthActions";

const resend = new Resend(RESEND_API_KEY);

const response: ServerActionResponse = {
    status: "success",
    message:
        "If an account exists for this email, we’ve sent a password reset link.",
};

export async function SendToken(email: string): Promise<ServerActionResponse> {
    try {
        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return response;

        await ResetToken.findOneAndDelete({ user: user._id });

        const token = await ResetToken.create({
            user: user._id,
            token: generateToken(),
            done: false,
        });

        const _headers = await headers();
        const origin =
            _headers.get("origin") ||
            `${_headers.get("x-forwarded-proto")}://${_headers.get("host")}`; // I got this from chatgpt

        await resend.emails.send({
            from: "Evrooma <intergalacticbeing@evrooma.online>",
            to: user.email,
            subject: "Reset Password",
            react: ResetPasswordEmail({
                href: `${origin}${resetPasswordPage}?token=${token.token}`,
            }),
        });

        return response;
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function ResetPassword(
    token: string,
    newPassword: string,
): Promise<ServerActionResponse> {
    const normalizedPassword = newPassword.trim();
    if (!normalizedPassword) {
        return {
            status: "error",
            message: "Please provide new password.",
        };
    }

    try {
        await connectDB();
        const foundToken = await ResetToken.findOne({ token: token.trim() });
        if (
            !foundToken ||
            foundToken.done ||
            Date.now() - (foundToken.createdAt as Date).getTime() >
                1000 * 60 * 15
        ) {
            return {
                status: "error",
                message:
                    "The password reset token is invalid, used, or has expired. Please request a new password reset to continue.",
            };
        }

        const user = await User.findById(foundToken.user);
        if (!user) {
            return {
                status: "error",
                message: "User cannot be found.",
            };
        }

        user.password = await encrypt(normalizedPassword);
        await user.save();

        if (user.type === "instructor") {
            await AuthenticateInstructor(user._id.toString(), true);
        } else {
            await AuthenticateStudent(user._id.toString(), true);
        }

        foundToken.done = true;
        await foundToken.save();

        return {
            status: "success",
            message: "Password changed successfully.",
        };
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}
