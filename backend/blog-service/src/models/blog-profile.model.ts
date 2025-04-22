import { model, Schema, Document, Types } from "mongoose";

export interface IBlogProfile extends Document {
    username: string;
    totalPosts: number;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    totalFollowers: number;
    totalFollowing: number;
}

export interface IMutualFollower {
    _id: Types.ObjectId;
    username: string;
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
