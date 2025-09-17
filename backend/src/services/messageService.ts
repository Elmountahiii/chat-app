import { MessageRepository } from "../repository/messageRepository";
import { AppError } from "../types/common";
import {
  CreateConversationInput,
  CreateMessageInput,
} from "../types/inputs/messagingInputs";
import { UserService } from "./userService";

export class MessageService {
  constructor(
    private messageRepo: MessageRepository,
    private userService: UserService
  ) {}

  async createConversation(input: CreateConversationInput, userId: string) {
    const { participants, type, groupName, groupAdmin } = input;

    // ? Check if user is a participant
    if (!participants.includes(userId)) {
      throw new AppError("User is not a participant in the conversation", 403);
    }

    if (type === "individual" && participants.length !== 2) {
      if (participants.length !== 2) {
        throw new AppError(
          "Individual conversations must have exactly 2 participants",
          400
        );
      }
      const friendship = await this.userService.getFriendshipStatus(
        participants[0],
        participants[1]
      );
      if (!friendship || friendship.status !== "accepted") {
        throw new AppError("Users are not friends", 403);
      }
    }

    if (type === "group") {
      if (groupName === undefined || groupAdmin === undefined) {
        throw new AppError("Group name and admin must be provided", 400);
      }
      if (participants.length < 3) {
        throw new AppError(
          "Group conversations must have at least 3 participants",
          400
        );
      } else if (groupName === undefined || groupAdmin === undefined) {
        throw new AppError("Group name and admin must be provided", 400);
      } else if (groupName.trim() === "") {
        throw new AppError("Group name must not be empty", 400);
      }
    }
    const conversation = await this.messageRepo.createConversation(input);
    return conversation;
  }

  async sendMessage(input: CreateMessageInput) {
    const { conversationId, content, senderId, messageType, fileInfo } = input;
    if (messageType === "text" && (!content || content.trim() === "")) {
      throw new AppError("Message content is required", 400);
    } else if (messageType === "file" && !fileInfo) {
      throw new AppError("File information is required", 400);
    }
    const message = await this.messageRepo.sendMessage({
      conversationId,
      content,
      senderId,
      messageType,
      fileInfo,
    });
    return message;
  }

  async getConversations(userId: string, page: number = 1, limit: number = 20) {
    const chats = await this.messageRepo.getConversations(userId, page, limit);
    return chats;
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit: number = 20
  ) {
    const conversation = await this.messageRepo.getConversationById(
      conversationId
    );
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const messages = await this.messageRepo.getConversationMessages(
      conversationId,
      cursor,
      limit
    );
    return messages;
  }

  async markConversationMessagesAsRead(conversationId: string, userId: string) {
    const conversation = await this.messageRepo.getConversationById(
      conversationId
    );
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const readData = await this.messageRepo.markConversationMessagesAsRead(
      conversationId,
      userId
    );
    return readData;
  }
}
