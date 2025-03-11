import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    googleId?: string;
    name: string;
    username?: string;
    email: string;
    password?: string;
    profileImage?: string;
    bio?: string;
    skills: string[];
    myCourses: {
        courseId: mongoose.Types.ObjectId;
        status: "in-progress" | "completed" | "not-started";
        enrolledAt: Date;
        lastAccessed?: Date;
    }[];
    role: "student" | "tutor" | "admin";
    isEmailVerified: boolean;
    isTutorVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        googleId: {
            type: String
        },
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        profileImage: { type: String, default: "" },
        bio: { type: String, default: "" },
        skills: { type: [String], default: [] },
        myCourses: [
            {
                courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
                status: { type: String, enum: ["in-progress", "completed", "not-started"], default: "not-started" },
                enrolledAt: { type: Date, default: Date.now },
                lastAccessed: { type: Date },
            },
        ],

        role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
        isEmailVerified: { type: Boolean, default: false },
        isTutorVerified: { type: Boolean, default: false },

    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
