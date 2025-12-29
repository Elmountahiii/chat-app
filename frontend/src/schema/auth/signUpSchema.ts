import * as z from "zod";

// Schema for the initial signup step (email + password only)
export const SignUpCredentialsSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpCredentialsType = z.infer<typeof SignUpCredentialsSchema>;

// Full signup data type (sent to backend after onboarding)
export type SignUpDataType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
};
