import * as z from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ForgotPasswordDataType = z.infer<typeof ForgotPasswordSchema>;
