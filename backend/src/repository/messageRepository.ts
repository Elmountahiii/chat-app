import { ConversationModel } from "../schema/mongodb/conversationSchema";
import {
  MessageDocumentType,
  MessageModel,
} from "../schema/mongodb/messageSchema";
import { AppError } from "../types/common";
import {
  CreateConversationInput,
  CreateMessageInput,
} from "../types/inputs/messagingInputs";

import mongoose, { FilterQuery } from "mongoose";

export class MessageRepository {
  constructor() {}

  async createConversation(input: CreateConversationInput) {
    const { participants, type, groupName, groupAdmin } = input;
    const existingConversation = await ConversationModel.findOne({
      participants: { $all: participants },
      type: type,
    });
    if (existingConversation) {
      return await existingConversation.populate("participants");
    }

    const readStatus = participants.map((participantId) => ({
      userId: participantId,
      lastReadMessage: null,
      lastReadAt: null,
      unreadCount: 0,
    }));

    const newConversation = new ConversationModel({
      participants: participants,
      type: type,
      groupName: groupName,
      groupAdmin: groupAdmin,
      readStatus: readStatus,
    });
    await newConversation.save();
    return await newConversation.populate("participants");
  }

  async getConversations(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await ConversationModel.find({
      participants: userId,
    })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .populate("participants")
      .populate("lastMessage.sender")
      .populate("readStatus.lastReadMessage");
  }

  async getConversationById(conversationId: string) {
    const conversation = await ConversationModel.findById(conversationId)
      .populate("participants")
      .populate("lastMessage.sender")
      .populate("readStatus.lastReadMessage");
    return conversation;
  }

  async sendMessage(input: CreateMessageInput) {
    const { conversationId, senderId, content, messageType, fileInfo } = input;
    // const session = await mongoose.startSession();
    try {
      // session.startTransaction();
      // const conversation = await ConversationModel.findOne({
      //   _id: conversationId,
      //   participants: senderId,
      // }).session(session);
      const conversation = await ConversationModel.findOne({
        _id: conversationId,
        participants: senderId,
      });

      if (!conversation) {
        throw new AppError("Unauthorized: User not in conversation", 404);
      }
      const message = new MessageModel({
        conversationId: conversationId,
        sender: senderId,
        content: content,
        messageType: messageType,
        fileInfo: fileInfo,
      });

      // await message.save({ session });
      await message.save();

      await ConversationModel.findByIdAndUpdate(
        conversationId,
        {
          $set: {
            lastMessage: {
              content: message.content,
              sender: message.sender,
              timeStamp: message.createdAt,
              messageType: message.messageType,
            },
          },
        }
        // { session }
      );
      await ConversationModel.updateOne(
        { _id: conversationId },
        {
          $inc: {
            "readStatus.$[elem].unreadCount": 1,
          },
        },
        {
          arrayFilters: [
            { "elem.userId": { $ne: new mongoose.Types.ObjectId(senderId) } },
          ],
        }
      );
      // await session.commitTransaction();
      return await message.populate("sender");
    } catch (error) {
      console.log(error);
      throw new AppError("Failed to send message", 500);
    } finally {
      // session.endSession();
    }
  }

  async getConversationMessages(
    conversationId: string,
    cursor?: string,
    limit: number = 20
  ) {
    const query: FilterQuery<MessageDocumentType> = {
      conversationId: conversationId,
    };

    if (cursor) {
      try {
        const cursorMessage = await MessageModel.findById(cursor);
        if (!cursorMessage) {
          throw new AppError("Invalid cursor", 400);
        }
        query.createdAt = { $lt: cursorMessage.createdAt };
      } catch (error) {
        throw new AppError("Invalid cursor", 400);
      }
    }
    const messages = await MessageModel.find(query)
      .limit(limit + 1)
      .sort({ createdAt: -1 })
      .populate("sender");
    const hasMore = messages.length > limit;
    if (hasMore) {
      messages.pop();
    }
    return {
      messages: messages.reverse(),
      hasMore,
    };
  }

  async markConversationMessagesAsRead(
    conversationId: string,
    userId: string,
    messageId?: string
  ) {
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();

      let targetMessage;
      if (messageId) {
        targetMessage = await MessageModel.findById(messageId).session(session);
      } else {
        targetMessage = await MessageModel.findOne({ conversationId })
          .sort({ createdAt: -1 })
          .session(session);
      }

      if (!targetMessage) {
        await session.abortTransaction();
        return {
          success: false,
          error: "Message not found",
          data: null,
        };
      }

      // Count messages that will be marked as read
      const unreadMessagesCount = await MessageModel.countDocuments({
        conversationId: conversationId,
        createdAt: { $lte: targetMessage.createdAt },
        "readBy.userId": { $ne: userId },
      }).session(session);

      // Mark all messages up to the target message as read using createdAt
      const markAsReadResult = await MessageModel.updateMany(
        {
          conversationId: conversationId,
          createdAt: { $lte: targetMessage.createdAt },
          "readBy.userId": { $ne: userId },
        },
        {
          $push: {
            readBy: {
              userId: userId,
              readAt: new Date(),
            },
          },
        },
        { session }
      );

      // Update or create read status
      await ConversationModel.findOneAndUpdate(
        {
          _id: conversationId,
          "readStatus.userId": userId,
        },
        {
          $set: {
            unreadCount: 0,
            "readStatus.$.lastReadMessage": targetMessage._id,
            "readStatus.$.lastReadAt": new Date(),
          },
        },
        { session }
      );

      await ConversationModel.findByIdAndUpdate(
        conversationId,
        {
          $addToSet: {
            readStatus: {
              userId: userId,
              lastReadMessage: targetMessage._id,
              lastReadAt: new Date(),
            },
          },
        },
        { session }
      );

      await session.commitTransaction();

      return {
        success: true,
        data: {
          conversationId,
          lastReadMessageId: targetMessage._id,
          messagesMarkedAsRead: markAsReadResult.modifiedCount,
          totalUnreadMessagesCleared: unreadMessagesCount,
          lastReadAt: new Date(),
          targetMessage: {
            id: targetMessage._id,
            content: targetMessage.content,
            createdAt: targetMessage.createdAt,
            sender: targetMessage.sender,
          },
        },
      };
    } catch (error) {
      await session.abortTransaction();
      throw new AppError("Failed to mark messages as read", 500);
    } finally {
      await session.endSession();
    }
  }
}
