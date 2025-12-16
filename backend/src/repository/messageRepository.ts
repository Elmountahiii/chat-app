import {
	Message,
	MessageModel,
	PopulatedMessage,
} from "../schema/mongodb/messageSchema";
import { ConversationModel } from "../schema/mongodb/conversationSchema";
import { AppError } from "../types/common";
import { CreateMessageInput } from "../types/inputs/messagingInputs";

import { FilterQuery } from "mongoose";

export class MessageRepository {
	constructor() {}

	async getConversationMessages(
		conversationId: string,
		cursor?: string,
		limit: number = 20,
	) {
		const query: FilterQuery<Message> = {
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
				console.log(error);
				throw new AppError("Invalid cursor", 400);
			}
		}
		const messages = await MessageModel.find(query)
			.limit(limit + 1)
			.sort({ createdAt: -1 })
			.populate("sender", "-password")
			.populate("readBy.user", "-password");

		return messages.reverse();
	}

	async sendMessage(input: CreateMessageInput): Promise<PopulatedMessage> {
		const { conversationId, senderId, content } = input;

		const message = new MessageModel({
			conversationId: conversationId,
			sender: senderId,
			content: content,
			readBy: [
				{
					user: senderId,
					readAt: new Date(),
				},
			],
		});

		await message.save();

		await ConversationModel.findByIdAndUpdate(conversationId, {
			lastMessage: message._id,
			updatedAt: new Date(),
		});

		return await message.populate([
			{ path: "sender" },
			{ path: "readBy.user" },
		]);
	}

	async getMessageById(messageId: string): Promise<PopulatedMessage> {
		const message = (await MessageModel.findById(messageId)
			.populate(["sender", "readBy.user"])
			.lean()) as unknown as PopulatedMessage;

		return message;
	}

	async markConversationMessagesAsRead(
		conversationId: string,
		userId: string,
	): Promise<boolean> {
		const result = await MessageModel.updateMany(
			{
				conversationId: conversationId,
				"readBy.user": { $ne: userId },
			},
			{
				$push: {
					readBy: {
						user: userId,
						readAt: new Date(),
					},
				},
			},
		);

		return result.modifiedCount > 0;
	}

	async getUnreadCount(conversationId: string, userId: string) {
		return await MessageModel.countDocuments({
			conversationId: conversationId,
			"readBy.user": { $ne: userId },
		});
	}
}
