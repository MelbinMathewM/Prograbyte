import { Schema, Document, model, Types } from "mongoose";

export interface IPost extends Document {
    user_id: Types.ObjectId | string;
    username: string;
    title: string;
    content: string;
    image?: string;
    likes: Types.ObjectId[];
    comments: number;
}

const postSchema = new Schema<IPost>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "BlogProfile"
    },
    username: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile'
        }
    ],
    comments: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Post = model("Post", postSchema);

export default Post;
