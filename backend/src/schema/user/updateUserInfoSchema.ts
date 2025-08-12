import * as z from "zod";
export const UpdateUserInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  profilePicture: z.string().url("Please enter a valid URL").optional(),
});