import { model, Schema, Document, ObjectId } from "mongoose";

export interface IBlogProfile extends Document {
    username: string;
    totalPosts: number;
    followers: ObjectId[];
    following: ObjectId[];
    totalFollowers: number;
    totalFollowing: number;
}

const blogProfileSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    totalPosts: {
        type: Number,
        default: 0
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile'
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile'
        }
    ],
    totalFollowers: {
        type: Number,
        default: 0
    },
    totalFollowing: {
        type: Number,
        default: 0
    },
}, { timestamps: true });


const BlogProfile = model<IBlogProfile>("BlogProfile", blogProfileSchema);

export default BlogProfile;
