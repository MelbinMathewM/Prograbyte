import { Schema, Document, model } from 'mongoose';

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

const Category = model<ICategory>("Category",categorySchema);

 export default Category;