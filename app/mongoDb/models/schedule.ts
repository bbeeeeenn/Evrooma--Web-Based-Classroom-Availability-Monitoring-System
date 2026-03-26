import { model, models, Schema, SchemaTypes } from "mongoose";

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
        required: false,
        trim: true,
    },
    slot: [slotSchema],
});

export const Schedule = models.Schedule || model("Schedule", scheduleSchema);
