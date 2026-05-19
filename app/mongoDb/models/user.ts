import { model, models, ObjectId, Schema } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export type PlainUserDocument = {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    fullName: string;
    type: "student" | "instructor";
    createdAt: Date;
};

const userSchema = new Schema(
    {
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
        password: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: ["student", "instructor"],
        },
    },
    {
        timestamps: true,
    },
);

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.plugin(mongooseLeanVirtuals);

export const User = models.User || model("User", userSchema);
