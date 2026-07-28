import {z} from "zod"


export const EditVideoSchema = z.object({
    title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
})

export type EditVideoFormData = z.infer<typeof EditVideoSchema>;