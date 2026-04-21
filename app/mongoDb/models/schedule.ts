import { model, models, ObjectId, Schema, SchemaTypes } from "mongoose";
import { PopulatedPlainRoomDocument } from "./room";
import { PlainInstructorDocument } from "./user";

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
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            required: true,
        },
        start: timeSchema,
        end: timeSchema,
    },
    { _id: false },
);

export type PlainScheduleDocument = {
    _id: ObjectId;
    room: ObjectId;
    instructor: ObjectId;
    subject: string;
    slot: {
        dayOfWeek:
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday"
            | "Sunday";
        start: { hour: number; minute: number };
        end: { hour: number; minute: number };
    };
};

export type PopulatedPlainScheduleDocument = Omit<
    PlainScheduleDocument,
    "room" | "instructor"
> & {
    room: PopulatedPlainRoomDocument;
    instructor: PlainInstructorDocument;
};

const scheduleSchema = new Schema({
    room: {
        type: SchemaTypes.ObjectId,
        ref: "Room",
        required: true,
    },
    instructor: {
        type: SchemaTypes.ObjectId,
        ref: "Instructor",
        required: true,
    },
    subject: {
        type: String,
        default: "Undefined",
        required: false,
        trim: true,
    },
    slot: slotSchema,
});

export const Schedule = models.Schedule || model("Schedule", scheduleSchema);
