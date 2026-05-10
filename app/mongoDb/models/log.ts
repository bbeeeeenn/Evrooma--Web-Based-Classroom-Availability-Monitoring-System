import "./user";
import "./schedule";
import { model, models, ObjectId, Schema, SchemaTypes } from "mongoose";
import { PlainUserDocument } from "./user";
import { PopulatedPlainScheduleDocument } from "./schedule";

export type PlainLogDocument = {
    _id: ObjectId;
    schedule: ObjectId;
    user: ObjectId;
    attendanceDate: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PopulatedPlainLogDocument = Omit<
    PlainLogDocument,
    "schedule" | "user"
> & {
    schedule: PopulatedPlainScheduleDocument;
    user: PlainUserDocument;
};

const attendanceLogSchema = new Schema(
    {
        schedule: {
            type: SchemaTypes.ObjectId,
            ref: "Schedule",
            required: true,
        },
        user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        attendanceDate: { type: String, required: true },
    },
    { timestamps: true },
);

attendanceLogSchema.index(
    { schedule: 1, user: 1, attendanceDate: 1 },
    { unique: true },
);

export const AttendanceLog =
    models.AttendanceLog || model("AttendanceLog", attendanceLogSchema);
