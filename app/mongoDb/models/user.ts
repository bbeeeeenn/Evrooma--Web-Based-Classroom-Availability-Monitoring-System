import { model, models, Schema } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export interface PlainUserDocument {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    fullName: string;
}

const instructorSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const adminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

adminSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
adminSchema.plugin(mongooseLeanVirtuals);
instructorSchema.plugin(mongooseLeanVirtuals);

export const Instructor =
    models.Instructor || model("Instructor", instructorSchema);

export const Admin = models.Admin || model("Admin", adminSchema);
