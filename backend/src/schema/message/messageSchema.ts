import { z } from "zod";

export const createConversationSchema = z.object({
  participants: z
    .array(
      z.string().min(2, "Participant ID must be at least 2 characters long")
    )
    .min(1, "At least one participant is required"),
  type: z.enum(["individual", "group"]),
  groupName: z.string().min(2).max(100).optional(),
  groupAdmin: z.string().optional(),
});

export const fetchConversationsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const fetchMessagesSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const markConversationMessagesAsReadSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  messageId: z.string().min(1, "Message ID is required").optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message content is required"),
  messageType: z.enum(["text", "image", "file", "audio"]),
  fileInfo: z
    .object({
      fileName: z.string().min(1, "File name is required"),
      fileSize: z.number().min(1, "File size is required"),
      fileUrl: z.url("File URL is required"),
      mimeType: z.string().min(1, "MIME type is required"),
    })
    .optional(),
});
