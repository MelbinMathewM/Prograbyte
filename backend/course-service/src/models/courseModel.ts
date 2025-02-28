import mongoose, {Schema, Document, ObjectId} from "mongoose";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface ICourse extends Document {
    title: string;
    description: string;
    category_id: string | ObjectId;
    tutor_id: string | ObjectId;
    price: number;
    preview_video_url: string;
    poster_url: string;
    approval_status: ApprovalStatus;
    rating: number | null
}

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    tutor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: "Tutor"
    },
    price: {
        type: Number,
        required: true
    },
    preview_video_url: {
        type: String,
        required: true
    },
    poster_url: {
        type: String,
        required: true
    },
    approval_status: {
        type: String,
        enum: ["Pending","Approved","Rejected"],
        default: "Pending", 
        required: true
    },
    rating: {
        type: Number,
        default: null
    }
}, { timestamps: true })

export const Course = mongoose.model("Course", courseSchema);
