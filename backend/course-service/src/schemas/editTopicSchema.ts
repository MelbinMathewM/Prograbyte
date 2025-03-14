import { z } from "zod";

export const editTopicSchema = z.object({
    topicId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid topic ID format"),
    title: z.string().min(1, "Title cannot be empty"),
    level: z.enum(["Basic", "Intermediate", "Advanced"]),
    video_url: z.string().url("Invalid video URL"),
    notes_url: z.union([z.string().url("Invalid notes URL"), z.literal("")]).optional(),
});
