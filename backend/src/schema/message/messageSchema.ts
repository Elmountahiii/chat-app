import { z } from "zod";

export const MessageSchema = z.object({
  recipientId: z.uuid(),
  content: z.string().min(1).max(1000),
});
