import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name : string;
    type : string;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },{ timestamps: true }
);

export default mongoose.model<ICategory>("Category",categorySchema);