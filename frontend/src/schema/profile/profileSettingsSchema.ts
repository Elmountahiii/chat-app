import * as z from "zod";

export const profileSettingsSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

	profilePicture: z
		.string()
		.min(1, "Please select a profile picture")
		.url("Profile picture must be a valid URL"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.optional()
		.or(z.literal("")),
	confirmPassword: z.string().optional().or(z.literal("")),
}).refine(
	(data) => {
		if (data.password && data.password !== data.confirmPassword) {
			return false;
		}
		return true;
	},
	{
		message: "Passwords do not match",
		path: ["confirmPassword"],
	},
);

export type ProfileSettingsDataType = z.infer<typeof profileSettingsSchema>;
