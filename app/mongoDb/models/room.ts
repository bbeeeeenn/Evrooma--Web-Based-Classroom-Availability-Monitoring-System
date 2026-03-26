import { model, ObjectId } from "mongoose";
import { models, Schema, SchemaTypes } from "mongoose";
import type { PlainBuildingDocument } from "./building";

export type PlainRoomDocument = {
    _id: ObjectId;
    code: string;
    building: ObjectId;
};

export type PopulatedPlainRoomDocument = Omit<PlainRoomDocument, "building"> & {
    building: PlainBuildingDocument;
};

const roomSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        building: {
            type: SchemaTypes.ObjectId,
            ref: "Building",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

// roomSchema.virtual("schedules", {
//     ref: "Schedule",
//     foreignField: "room",
//     localField: "_id",
// });

roomSchema.index(
    { building: 1, code: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } },
);

export const Room = models.Room || model("Room", roomSchema);
