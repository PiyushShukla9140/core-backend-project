import {z} from "zod"

export const accountSchema = z.object(
    {
        fullName:z
        .string()
        .min(3,"Full name should be of minimum 3 characters")
        .trim(),

        username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Only letters, numbers and underscores are allowed"
        ),

        email: z
            .string()
            .email(),
    }
)

export type AccountFormData = z.infer<typeof accountSchema>;