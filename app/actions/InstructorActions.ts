"use server";

import { ServerActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Instructor } from "@/app/mongoDb/models/user";
import { encrypt } from "@/app/lib/bcrypt";

export type RawInstructorData = {
    fname: string;
    lname: string;
    email: string;
    password: string;
};
export async function CreateInstructor(
    data: RawInstructorData,
): Promise<ServerActionResponse> {
    const { fname, lname, email, password } = data;

    const firstName = fname.trim();
    const lastName = lname.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!firstName || !lastName || !normalizedEmail || !normalizedPassword) {
        return {
            status: "error",
            message: "Please complete all required fields.",
        };
    }

    const emailRegex = /^\S+@\S+\.\S+$/; // i need to study about regex >.<
    if (!emailRegex.test(normalizedEmail)) {
        return {
            status: "error",
            message: "Please provide a valid email address.",
        };
    }

    try {
        await connectDB();

        const existingInstructor = await Instructor.findOne({
            email: normalizedEmail,
        }).lean();

        if (existingInstructor) {
            return {
                status: "error",
                message: "Instructor email already exists.",
            };
        }

        const hashedPassword = await encrypt(normalizedPassword);

        await Instructor.create({
            firstName,
            lastName,
            email: normalizedEmail,
            username: normalizedEmail,
            password: hashedPassword,
        });

        return {
            status: "success",
            message: "Instructor created successfully.",
        };
    } catch (e) {
        console.error("[CreateInstructor]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}
