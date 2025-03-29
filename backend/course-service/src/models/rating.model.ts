import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  rating: number;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRating extends Document {
  courseId: Types.ObjectId;
  reviews: IReview[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, maxlength: 500 },
  },
  { timestamps: true, _id: true }
);

const CourseRatingSchema = new Schema<IRating>(
  {
    courseId: { type: Schema.Types.ObjectId, required: true, index: true },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

const CourseRating = mongoose.model<IRating>("CourseRating", CourseRatingSchema);

export default CourseRating;
