import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    googleId?: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    profileImage?: string;
    bio?: string;
    skills: string[];
    role: "student" | "tutor" | "admin";
    isEmailVerified: boolean;
    isTutorVerified?: boolean;
    isBlocked: boolean;
    isPremium?: boolean;
    createdAt: Date;
    updatedAt: Date;
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
        username: { 
            type: String, 
            required: true, 
            unique: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        profileImage: { 
            type: String, 
            default: "" 
        },
        bio: { 
            type: String, 
            default: "" 
        },
        skills: { 
            type: [String], 
            default: [] 
        },
        role: { 
            type: String, 
            enum: ["student", "tutor", "admin"], 
            default: "student" 
        },
        isEmailVerified: { 
            type: Boolean, 
            default: false 
        },
        isTutorVerified: { 
            type: Boolean, 
            default: false 
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isPremium: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
