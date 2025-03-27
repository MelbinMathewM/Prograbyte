import { z } from "zod";
import mongoose from "mongoose";

export const topicSchema = z.object({
  course_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid course ID",
  }),
  title: z.string().min(1, "Title is required").trim(),
  level: z.enum(["Basic", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Invalid level type" }),
  }),
  video_url: z.string().url("Invalid video URL"),
  notes_url: z.union([z.string().url("Invalid notes URL"), z.literal("")]).optional(),
});

export const topicsSchema = z.object({
  course_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid course ID",
  }),
  topics: z.array(topicSchema.omit({ course_id: true })).nonempty("At least one topic is required"),
});
