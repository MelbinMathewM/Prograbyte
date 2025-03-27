import { z } from "zod";

export const editCourseSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  category_id: z.string().optional(),
  tutor_id: z.string().optional(),
  price: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Price must be a valid positive number",
    }),

  poster_url: z.string().trim().optional(),
  preview_video_urls: z.array(z.string()).optional(),
});
