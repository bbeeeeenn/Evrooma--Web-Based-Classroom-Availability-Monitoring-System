import { model, models, ObjectId, Schema } from "mongoose";

export interface PlainBuildingDocument {
    _id: ObjectId;
    name: string;
}

const buildingSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true },
);

buildingSchema.index(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } },
);

// buildingSchema.virtual("rooms", {
//     ref: "Room",
//     foreignField: "building",
//     localField: "_id",
// });

export const Building = models.Building || model("Building", buildingSchema);
