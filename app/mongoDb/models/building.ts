import { model, models, Schema } from "mongoose";

const buildingSchema = new Schema({
    name: { type: String, required: true },
});

export interface PlainBuildingDocument {
    _id: string;
    name: string;
}

export const Building = models.Building || model("Building", buildingSchema);
