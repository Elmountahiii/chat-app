import * as z from "zod";

export const OnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  profilePicture: z.string().optional(),
});

export type OnboardingDataType = z.infer<typeof OnboardingSchema>;
