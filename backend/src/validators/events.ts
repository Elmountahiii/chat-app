import { EventEmitter } from "events";
import { MessageDocumentType } from "../schema/mongodb/messageSchema";
import { ConversationDocumentType } from "../schema/mongodb/conversationSchema";
import { UserDocumentType } from "../schema/mongodb/userSchema";
import { FriendshipDocumentType } from "../schema/mongodb/friendshipSchema";

type MessagingEvents = {
  "message:created": (data: {
    conversationId: string;
    message: MessageDocumentType;
    userId: string;
  }) => void;
  "message:read": (data: {
    conversationId: string;
    messageId: string;
    totalUnreadMessagesCleared: number;
    user: UserDocumentType;
    lastReadAt: Date;
  }) => void;
  "message:edited": (data: {
    conversationId: string;
    messageId: string;
    newContent: string;
    editedAt: Date;
  }) => void;
  "message:deleted": (data: {
    conversationId: string;
    messageId: string;
    deletedAt: Date;
  }) => void;
  "user:statusChanged": (data: {
    userId: string;
    newStatus: "online" | "offline" | "away";
  }) => void;
  "conversation:created": (data: {
    userId: string;
    participants: string[];
    conversation: ConversationDocumentType;
  }) => void;

  "broadcast:statusChanged": (data: {
    status: "online" | "offline" | "away";
    user: UserDocumentType;

    friends: UserDocumentType[];
  }) => void;

  "broadcast:requestSent": (data: {
    userId: string;
    receiverId: string;
    friendShipRequest: FriendshipDocumentType;
  }) => void;
};

export class TypedEventEmitter extends EventEmitter {
  emit<T extends keyof MessagingEvents>(
    event: T,
    data: Parameters<MessagingEvents[T]>[0]
  ): boolean {
    return super.emit(event, data);
  }

  on<T extends keyof MessagingEvents>(
    event: T,
    listener: MessagingEvents[T]
  ): this {
    return super.on(event, listener);
  }
}
