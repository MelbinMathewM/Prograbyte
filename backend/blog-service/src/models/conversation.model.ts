import { Schema, model, Types, Document } from "mongoose";

export interface IConversation extends Document {
    participants: Types.ObjectId[];
}

const conversationSchema = new Schema<IConversation>({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogProfile',
            required: true
        }
    ],
}, { timestamps: true });

export const Conversation = model<IConversation>('Conversation', conversationSchema);
