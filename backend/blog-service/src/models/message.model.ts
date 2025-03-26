import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
    createdAt?: Date
}

const messageSchema = new Schema<IMessage>({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'BlogProfile',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'BlogProfile',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const Message = model<IMessage>('Message', messageSchema);
