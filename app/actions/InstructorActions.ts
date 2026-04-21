"use server";

import { ServerActionResponse } from "./_";
import { connectDB } from "@/app/mongoDb/mongodb";
import { Instructor } from "@/app/mongoDb/models/user";
import { encrypt } from "@/app/lib/bcrypt";
import { AuthenticateAdmin } from "./AdminAuthActions";
import { revalidatePath } from "next/cache";
import { adminAccountsPage } from "@/constants";
import { isValidObjectId } from "mongoose";

export type RawInstructorData = {
    fname: string;
    lname: string;
    email: string;
    password: string;
};
export async function CreateInstructor(
    data: RawInstructorData,
): Promise<ServerActionResponse & { instructorId?: string }> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }

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
                message: "Instructor with such email already exists.",
            };
        }

        const hashedPassword = await encrypt(normalizedPassword);

        const newInstructor = await Instructor.create({
            firstName,
            lastName,
            email: normalizedEmail,
            username: normalizedEmail,
            password: hashedPassword,
        });
        revalidatePath(adminAccountsPage);

        return {
            status: "success",
            message: "Instructor created successfully.",
            instructorId: newInstructor._id.toString(),
        };
    } catch (e) {
        console.error("[CreateInstructor]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function ChangeInstructorFirstName(
    instructorId: string,
    fname: string,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }
    if (!isValidObjectId(instructorId)) {
        return {
            status: "error",
            message: "Invalid instructor ID",
        };
    }

    const firstName = fname.trim();
    if (!firstName) {
        return {
            status: "error",
            message: "Please provide a first name.",
        };
    }

    try {
        await connectDB();
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }
        instructor.firstName = firstName;
        await instructor.save();
        revalidatePath(adminAccountsPage);

        return {
            status: "success",
            message: "Renamed successfully",
        };
    } catch (e) {
        console.error("[ChangeInstructorFirstName]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function ChangeInstructorLastName(
    instructorId: string,
    lname: string,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }
    if (!isValidObjectId(instructorId)) {
        return {
            status: "error",
            message: "Invalid instructor ID",
        };
    }

    const lastName = lname.trim();
    if (!lastName) {
        return {
            status: "error",
            message: "Please provide a last name.",
        };
    }

    try {
        await connectDB();
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }
        instructor.lastName = lastName;
        await instructor.save();
        revalidatePath(adminAccountsPage);

        return {
            status: "success",
            message: "Renamed successfully",
        };
    } catch (e) {
        console.error("[ChangeInstructorLastName]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function ChangeInstructorPassword(
    instructorId: string,
    password: string,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }
    if (!isValidObjectId(instructorId)) {
        return {
            status: "error",
            message: "Invalid instructor ID",
        };
    }

    const normalizedPassword = password.trim();
    if (!normalizedPassword) {
        return {
            status: "error",
            message: "Please provide a password.",
        };
    }

    try {
        await connectDB();
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }
        instructor.password = await encrypt(normalizedPassword);
        await instructor.save();

        return {
            status: "success",
            message: "Password changed successfully",
        };
    } catch (e) {
        console.error("[ChangeInstructorPassword]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function ChangeInstructorEmail(
    instructorId: string,
    email: string,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }
    if (!isValidObjectId(instructorId)) {
        return {
            status: "error",
            message: "Invalid instructor ID",
        };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
        return {
            status: "error",
            message: "Please provide an email.",
        };
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
        return {
            status: "error",
            message: "Please provide a valid email address.",
        };
    }

    try {
        await connectDB();
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }

        const existingInstructor = await Instructor.findOne({
            _id: { $ne: instructor._id },
            email: normalizedEmail,
        }).lean();
        if (existingInstructor) {
            return {
                status: "error",
                message: "Instructor with such email already exists.",
            };
        }

        instructor.email = normalizedEmail;
        await instructor.save();
        revalidatePath(adminAccountsPage);

        return {
            status: "success",
            message: "Email changed successfully",
        };
    } catch (e) {
        console.error("[ChangeInstructorEmail]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function DeleteInstructor(
    instructorId: string,
): Promise<ServerActionResponse> {
    if (!isValidObjectId(instructorId))
        return {
            status: "error",
            message: "Invalid instructor ID.",
        };

    try {
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            return {
                status: "error",
                message: "Instructor with such ID was not found.",
            };
        }

        await instructor.deleteOne();
        revalidatePath(adminAccountsPage);

        return {
            status: "success",
            message: "Deleted successfully.",
        };
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}
