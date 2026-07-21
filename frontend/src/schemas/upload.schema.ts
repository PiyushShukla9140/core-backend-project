import { z } from "zod";

export const uploadSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters"),

    thumbnail: z.instanceof(File, {
        message: "Thumbnail is required",
    }),

    videoFile: z.instanceof(File, {
        message: "Video is required",
    }),
});

export type UploadSchema = z.infer<typeof uploadSchema>;