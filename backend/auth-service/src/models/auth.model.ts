import mongoose, { Schema, Document } from 'mongoose';

export interface IAuth extends Document {
    email: string;
    password: string;
    role: "student" | "tutor" | "admin";
}

const AuthSchema = new Schema<IAuth>(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["student","tutor","admin"],
            required: true
        }
    }, { timestamps: true }
);

const Auth = mongoose.model<IAuth>("Auth",AuthSchema);

export default Auth;