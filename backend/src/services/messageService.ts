import { MessageRepository } from "../repository/messageRepository";

export class MessageService {
  constructor(private messageRepo: MessageRepository) {}

  async sendMessage(senderId: string, recipientId: string, content: string) {
    return await this.messageRepo.saveMessage(senderId, recipientId, content);
  }

  async getMessageHistory(userId: string, friendId: string) {
    return await this.messageRepo.getMessagesBetweenUsers(userId, friendId);
  }

  async markAsRead(recipientId: string, senderId: string) {
    return await this.messageRepo.markMessagesAsRead(recipientId, senderId);
  }
}
