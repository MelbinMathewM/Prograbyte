import mongoose, { Schema, Document, ObjectId } from "mongoose";

export type LevelType = "Basic" | "Intermediate" | "Advanced";

export interface ITopic {
    _id?: string;
    title: string;
    level: LevelType;
    video_url: string;
    notes_url?: string;
}

export interface ITopics extends Document {
    course_id: string | mongoose.Types.ObjectId;
    topics: ITopic[];
}

const topicSchema = new Schema<ITopic>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        level: {
            type: String,
            enum: ["Basic", "Intermediate", "Advanced"],
            required: [true, "Level is required"],
            default: "Basic",
        },
        video_url: {
            type: String,
            required: [true, "Video URL is required"],
            validate: {
                validator: (url: string) => /^https?:\/\/.+/.test(url),
                message: "Invalid video URL",
            },
        },
        notes_url: {
            type: String,
            default: "",
            validate: {
                validator: (url: string) => !url || /^https?:\/\/.+/.test(url),
                message: "Invalid notes URL",
            },
        },
    },
);

const topicsSchema = new Schema<ITopics>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Course ID is required"],
        },
        topics: {
            type: [topicSchema],
            validate: {
                validator: (topics: ITopic[]) => topics.length > 0,
                message: "At least one topic is required",
            },
        },
    },
    { timestamps: true }
);

export const Topic = mongoose.model<ITopics>("Topic", topicsSchema);
