import { Schema, Document, ObjectId, model } from "mongoose";

export interface IPost extends Document {
    user_id: ObjectId | string;
    username: string;
    title: string;
    content: string;
    image?: [string];
    likes: ObjectId[];
    comments: ObjectId[];
}

const postSchema = new Schema<IPost>({
    user_id: {
        type: Schema.Types.ObjectId,
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
        type: [String]
    },
    likes: [
        { 
            type: Schema.Types.ObjectId ,
            ref: 'BlogUser'
        }
    ],
    comments: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Comment' 
        }
    ],
}, { timestamps: true });

const Post = model("Post", postSchema);

export default Post;
