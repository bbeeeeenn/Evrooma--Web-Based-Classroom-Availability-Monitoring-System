import "./user";
import { model, models, ObjectId, Schema, SchemaTypes } from "mongoose";
import { PlainUserDocument } from "./user";

export type PlainResetTokenDocument = {
    _id: string;
    user: ObjectId;
    token: string;
    done: boolean;
    createdAt: Date;
};

export type PopulatedPlainResetTokenDocument = Omit<
    PlainResetTokenDocument,
    "user"
> & {
    user: PlainUserDocument;
};

const resetTokenSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        done: SchemaTypes.Boolean,
    },
    {
        timestamps: true,
    },
);

export const ResetToken =
    models.ResetToken || model("ResetToken", resetTokenSchema);
