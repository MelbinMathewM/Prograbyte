import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  category_id: z.string().min(1, "Category ID is required"),
  tutor_id: z.string().min(1, "Tutor is required"),
  price: z.string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid positive number",
    }),

  poster_url: z.string().min(1, "Poster file is required").trim(),
  preview_video_urls: z.array(z.string().min(1, "Preview video file is required")),
});
