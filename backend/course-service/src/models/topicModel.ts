import mongoose, {Schema, Document, ObjectId} from "mongoose";

export type levelType = "Basic" | "Intermediate" | "Advanced";

export interface ITopic extends Document {
    course_id: string | ObjectId;
    title: string;
    level: levelType;
    video_url: string;
    notes_url: string;
}

const topicSchema = new Schema<ITopic>({
    course_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    title: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["Basic", "Intermediate", "Advanced"],
        default: "Basic",
        required: true
    },
    video_url: {
        type: String,
        required: true
    },
    notes_url: {
        type: String
    }
}, { timestamps: true });

export const Topic = mongoose.model("Topic", topicSchema);