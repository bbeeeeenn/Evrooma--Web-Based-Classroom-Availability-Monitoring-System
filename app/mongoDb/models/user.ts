import { model, models, ObjectId, Schema } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export interface PlainUserDocument {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    fullName: string;
}

const adminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});
adminSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const instructorSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
});
instructorSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

adminSchema.plugin(mongooseLeanVirtuals);
instructorSchema.plugin(mongooseLeanVirtuals);

export const Instructor =
    models.Instructor || model("Instructor", instructorSchema);
export const Admin = models.Admin || model("Admin", adminSchema);
