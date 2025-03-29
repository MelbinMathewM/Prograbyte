import mongoose, { Schema, Document } from "mongoose";

export interface IEnrolledCourse {
    courseId: mongoose.Types.ObjectId;
    paymentAmount: number;
    enrolledAt: Date;
    paymentId: string;
    completionStatus: number;
    progress: IProgress[];
}

export interface IProgress {
    topicId: mongoose.Types.ObjectId;
    watchedDuration: number;
    isCompleted: boolean;
}

export interface IEnrolledCourses extends Document {
    userId: mongoose.Types.ObjectId;
    courses: IEnrolledCourse[];
}

const enrolledCourseSchema = new Schema<IEnrolledCourses>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    courses: [
        {
            courseId: {
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: true
            },
            paymentAmount: {
                type: Number,
                required: true
            },
            enrolledAt: {
                type: Date,
                default: Date.now
            },
            paymentId: {
                type: String,
                required: true
            },
            completionStatus: {
                type: Number,
                default: 0
            },
            progress: [
                {
                    topicId: { type: Schema.Types.ObjectId, ref: "Topic" },
                    watchedDuration: { type: Number, default: 0 },
                    isCompleted: { type: Boolean, default: false }
                }
            ]
        }
    ]
}, { timestamps: true });

const EnrolledCourses = mongoose.model<IEnrolledCourses>("EnrolledCourse", enrolledCourseSchema);

export default EnrolledCourses;