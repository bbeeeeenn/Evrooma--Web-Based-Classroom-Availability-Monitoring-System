import "./room";
import "./user";
import { model, models, ObjectId, Schema, SchemaTypes } from "mongoose";
import type { PopulatedPlainRoomDocument } from "./room";
import type { PlainUserDocument } from "./user";

export type PlainScheduleDocument = {
    _id: ObjectId;
    room: ObjectId;
    instructor: ObjectId;
    subject: string;
    slot: {
        dayOfWeek: number;
        start: { hour: number; minute: number };
        end: { hour: number; minute: number };
    };
};

export type PopulatedPlainScheduleDocument = Omit<
    PlainScheduleDocument,
    "room" | "instructor"
> & {
    room: PopulatedPlainRoomDocument;
    instructor: PlainUserDocument;
};

const timeSchema = new Schema(
    {
        hour: { type: Number, min: 0, max: 23, required: true },
        minute: { type: Number, min: 0, max: 59, required: true },
    },
    { _id: false },
);

const slotSchema = new Schema(
    {
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6,
            required: true,
        },
        start: timeSchema,
        end: timeSchema,
    },
    { _id: false },
);

const scheduleSchema = new Schema({
    room: {
        type: SchemaTypes.ObjectId,
        ref: "Room",
        required: true,
    },
    instructor: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    subject: {
        type: String,
        default: "Undefined",
        trim: true,
    },
    slot: slotSchema,
});

scheduleSchema.index({ room: 1, "slot.dayOfWeek": 1 });
scheduleSchema.index({ instructor: 1 });

export const Schedule = models.Schedule || model("Schedule", scheduleSchema);
