import mongoose, { Schema, Document } from "mongoose";

export interface IEnrolledCourse {
    courseId: mongoose.Types.ObjectId;
    paymentAmount: number;
    enrolledAt: Date;
    paymentId: string;
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
            }
        }
    ]
}, { timestamps: true });

const EnrolledCourses = mongoose.model<IEnrolledCourses>("EnrolledCourse", enrolledCourseSchema);

export default EnrolledCourses;