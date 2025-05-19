import { Schema, Document, Types,  model } from "mongoose";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface ICourse extends Document {
    title: string;
    description: string;
    category_id: Types.ObjectId;
    tutor_id: Types.ObjectId;
    price: number;
    preview_video_urls: string[];
    poster_url: string;
    approval_status: ApprovalStatus;
    rating: number | null;
    offer: Types.ObjectId | null;
    enrollments: number;
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
        ref: "Tutor"
    },
    price: {
        type: Number,
        required: true
    },
    preview_video_urls: {
        type: [String],
        required: true,
        default: []
    },
    poster_url: {
        type: String,
        required: true
    },
    approval_status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
        required: true
    },
    rating: {
        type: Number,
        default: null
    },
    offer: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
        default: null,
    },
    enrollments: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Course = model<ICourse>("Course", courseSchema);

export default Course;
