"use server";

import { isValidObjectId } from "mongoose";
import { ServerActionResponse } from "./_";
import { AuthenticateAdmin } from "./AdminAuthActions";
import { Building } from "@/app/mongoDb/models/building";
import { Room } from "@/app/mongoDb/models/room";
import { connectDB } from "@/app/mongoDb/mongodb";
import { revalidatePath } from "next/cache";
import { adminRoomsPage } from "@/constants";

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function AddClassroom(
    buildingId: string,
    classroomCode: string,
): Promise<ServerActionResponse> {
    if (!(await AuthenticateAdmin())) {
        return {
            status: "error",
            message: "Unauthorized.",
        };
    }
    if (!isValidObjectId(buildingId)) {
        return {
            status: "error",
            message: "Invalid building ID.",
        };
    }

    const sanitizedClassRoomCode = classroomCode.trim().toUpperCase();
    if (!sanitizedClassRoomCode) {
        return {
            status: "error",
            message: "Classroom code is required.",
        };
    }

    try {
        await connectDB();

        const building = await Building.findById(buildingId);
        if (!building) {
            return {
                status: "error",
                message: "Building with such ID was not found.",
            };
        }

        const existingRoom = await Room.findOne({
            building: building._id,
            code: {
                $regex: `^${escapeRegex(sanitizedClassRoomCode)}$`,
                $options: "i",
            },
        }).lean();

        if (existingRoom) {
            return {
                status: "error",
                message: "Classroom with such code already exists.",
            };
        }

        await Room.create({
            code: sanitizedClassRoomCode,
            building: building._id,
        });

        revalidatePath(`${adminRoomsPage}/${buildingId}`);
        return {
            status: "success",
            message: "Classroom created.",
        };
    } catch (e) {
        if (
            typeof e === "object" &&
            e !== null &&
            "code" in e &&
            (e as { code?: number }).code === 11000
        ) {
            // AI Generated
            //  Why this matters:

            // You already pre-check duplicates, but two concurrent requests can still race.
            // Your unique index in room.ts is the final protection.
            // When that index rejects a duplicate insert, this block converts that DB error into a clean app response.
            return {
                status: "error",
                message: "Classroom with such code already exists.",
            };
        }

        console.error("[AddClassroom]", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
}
