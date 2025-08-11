import * as z from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpDataType = z.infer<typeof SignUpSchema>;
