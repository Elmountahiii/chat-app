// ...existing code...

import { User } from "./user";

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  messageType: "text" | "image" | "file" | "audio";
  fileInfo?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    mimeType?: string;
  };
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  readBy: {
    userId: string;
    readAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

