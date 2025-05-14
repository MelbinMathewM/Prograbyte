import { Schema, Document, Types, model } from "mongoose";

export interface IEnrolledCourse {
    courseId: Types.ObjectId;
    paymentAmount: number;
    enrolledAt: Date;
    paymentId?: string;
    completionStatus: number;
    progress: IProgress[];
}

export interface IProgress {
    topicId: Types.ObjectId;
    watchedDuration: number;
    isCompleted: boolean;
}

export interface IEnrolledCourses extends Document {
    userId: Types.ObjectId;
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
                type: String
            },
            completionStatus: {
                type: Number,
                default: 0
            },
            progress: [
                {
                    topicId: { 
                        type: Schema.Types.ObjectId, 
                        ref: "Topic" 
                    },
                    watchedDuration: { 
                        type: Number, 
                        default: 0 
                    },
                    isCompleted: { 
                        type: Boolean,
                        default: false 
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

const EnrolledCourses = model<IEnrolledCourses>("EnrolledCourse", enrolledCourseSchema);

export default EnrolledCourses;