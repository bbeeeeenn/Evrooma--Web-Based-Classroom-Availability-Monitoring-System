import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    { timestamps: true },
);
userSchema.index({ username: 1 });

export interface PlainUserDocument {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: "admin" | "instructor";
}

export const User = models.User || model("User", userSchema);
