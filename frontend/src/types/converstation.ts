import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
  _id: string;
  participants: User[];
  type: "individual" | "group";
  groupName?: string;
  groupAdmin?: User;
  lastMessage?: {
    content?: string;
    sender?: User;
    timeStamp: Date;
    messageType: "text" | "image" | "file" | "audio";
  };
  readStatus: {
    userId: string;
    lastReadMessage: Message;
    lastReadAt?: Date;
    unreadCount: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
