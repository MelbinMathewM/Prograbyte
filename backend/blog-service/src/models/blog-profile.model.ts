import { model, Schema, Document, ObjectId } from "mongoose";

export interface IBlogProfile extends Document {
    user_id: ObjectId | string;
    totalPosts: number;
    followers: ObjectId[];
    following: ObjectId[];
    totalFollowers: number;
    totalFollowing: number;
}

const blogProfileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    totalPosts: {
        type: Number,
        default: 0
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
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


const BlogProfile = model("BlogUser", blogProfileSchema);

export default BlogProfile;
