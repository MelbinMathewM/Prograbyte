import { Schema, Document, Types, model } from "mongoose";

export type LevelType = "Basic" | "Intermediate" | "Advanced";

export interface ITopic {
    _id?: string;
    title: string;
    level: LevelType;
    video_url: string;
    notes_url?: string;
}

export interface ITopics extends Document {
    course_id: Types.ObjectId;
    topics: ITopic[];
}

const topicSchema = new Schema<ITopic>(
    {
        title: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ["Basic", "Intermediate", "Advanced"],
            required: true,
            default: "Basic",
        },
        video_url: {
            type: String,
            required: true,
        },
        notes_url: {
            type: String,
            default: "",
        },
    },
);

const topicsSchema = new Schema<ITopics>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        topics: {
            type: [topicSchema],
        },
    },
    { timestamps: true }
);

const Topic = model<ITopics>("Topic", topicsSchema);

export default Topic;
