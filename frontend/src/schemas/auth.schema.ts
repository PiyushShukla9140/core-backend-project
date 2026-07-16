import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData =
    z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name is too long"),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),

    email: z
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string(),

    avatar: z
      .instanceof(File, {
        message: "Avatar is required",
      }),

    coverImage: z
      .instanceof(File)
      .optional(),
  })
  // .refine is used to match the password and current password content
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type SignupFormData =
  z.infer<typeof signupSchema>;