import * as z from "zod";
export const UserSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least 1 characters long")
    .max(15, "Username must be at most 15 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  profilePicture: z.url("Invalid URL for profile picture").optional(),
  status: z.enum(["online", "offline", "away"]),
});

export const UpdateUserSchema = UserSchema.partial();

export type UserDataUpdates = z.infer<typeof UpdateUserSchema>;
