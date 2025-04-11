import { Schema, Document, Types, model } from "mongoose";

export interface ICommentContent extends Document {
    user_id: Types.ObjectId | string;
    username: string;
    content: string;
    likes: Types.ObjectId[];
    sub_comments: ISubComment[];
}

export interface ISubComment extends Document {
    user_id: Types.ObjectId | string;
    username: string;
    content: string;
    likes: Types.ObjectId[];
}

export interface IComment extends Document {
    post_id: Types.ObjectId | string;
    comments: ICommentContent[];
}

const subCommentSchema = new Schema<ICommentContent>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'BlogProfile',
        required: true,
    },
    username: {
        type: String
    },
    content: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile',
            default: [],
        }
    ]
}, { timestamps: true });

const commentContentSchema = new Schema<ICommentContent>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'BlogProfile',
        required: true,
    },
    username: {
        type: String
    },
    content: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile',
            default: [],
        }
    ],
    sub_comments: [subCommentSchema]
}, { timestamps: true });


const commentSchema = new Schema<IComment>({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    comments: [commentContentSchema]
}, { timestamps: true });

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
