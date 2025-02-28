import mongoose, { Schema, Document} from "mongoose";

export interface IUser extends Document {
    googleId?: string,
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: "student" | "tutor" | "admin";
}

const UserSchema = new Schema<IUser>(
    {
        googleId: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ["student", "tutor", "admin"],
            required: true
        }
    }, { timestamps: true }
)

export default mongoose.model<IUser>("User",UserSchema);