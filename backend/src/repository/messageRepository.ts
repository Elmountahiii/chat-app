import { MessageModel } from "../schema/mongodb/messageSchema";
import { AppError } from "../types/common";
import { FriendshipRepository } from "./friendshipRepository";

export class MessageRepository {
  constructor(private friendshipRepository: FriendshipRepository) {}

  async saveMessage(senderId: string, recipientId: string, content: string) {
    const friendshipStatus =
      await this.friendshipRepository.getFriendshipStatus(
        senderId,
        recipientId
      );
    if (friendshipStatus.status !== "accepted") {
      throw new AppError(
        "You can only send messages to accepted friends.",
        403
      );
    }
    const message = new MessageModel({
      sender: senderId,
      recipient: recipientId,
      content: content,
    });

    return await message.save();
  }

  async getMessagesBetweenUsers(
    userId1: string,
    userId2: string,
    limit: number = 50
  ) {
    return await MessageModel.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("sender recipient")
      .lean();
  }

  async markMessagesAsRead(recipientId: string, senderId: string) {
    return await MessageModel.updateMany(
      { sender: senderId, recipient: recipientId, readAt: null },
      { readAt: new Date() }
    );
  }
}
