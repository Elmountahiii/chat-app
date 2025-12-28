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

	async loadInitialMessages(
		userId: string,
		conversationId: string,
		minMessages: number = 20,
	): Promise<PopulatedMessage[]> {
		// Count unread messages for this user
		const unreadCount = await MessageModel.countDocuments({
			conversationId: conversationId,
			"readBy.user": { $ne: userId },
		});

		// If no unread messages, load the last minMessages
		if (unreadCount === 0) {
			const messages = (await MessageModel.find({ conversationId })
				.sort({ createdAt: -1 })
				.limit(minMessages)
				.populate("sender", "-password")
				.populate("readBy.user", "-password")) as unknown as PopulatedMessage[];
			return messages.reverse();
		}

		// Find the oldest unread message to use as anchor
		const oldestUnread = await MessageModel.findOne({
			conversationId: conversationId,
			"readBy.user": { $ne: userId },
		}).sort({ createdAt: 1 });

		if (!oldestUnread) {
			// Fallback (shouldn't happen since unreadCount > 0)
			const messages = (await MessageModel.find({ conversationId })
				.sort({ createdAt: -1 })
				.limit(minMessages)
				.populate("sender", "-password")
				.populate("readBy.user", "-password")) as unknown as PopulatedMessage[];
			return messages.reverse();
		}

		// Calculate how many context messages we need before the first unread
		const contextNeeded = Math.max(0, minMessages - unreadCount);

		// Get context messages (messages before the oldest unread)
		let contextMessages: PopulatedMessage[] = [];
		if (contextNeeded > 0) {
			contextMessages = (await MessageModel.find({
				conversationId: conversationId,
				createdAt: { $lt: oldestUnread.createdAt },
			})
				.sort({ createdAt: -1 })
				.limit(contextNeeded)
				.populate("sender", "-password")
				.populate("readBy.user", "-password")) as unknown as PopulatedMessage[];
			contextMessages = contextMessages.reverse();
		}

		// Get all unread messages
		const unreadMessages = (await MessageModel.find({
			conversationId: conversationId,
			"readBy.user": { $ne: userId },
		})
			.sort({ createdAt: 1 })
			.populate("sender", "-password")
			.populate("readBy.user", "-password")) as unknown as PopulatedMessage[];

		return [...contextMessages, ...unreadMessages];
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

		const populatedMessage = await message.populate([
			{ path: "sender", select: "-password" },
			{ path: "readBy.user", select: "-password" },
		]);

		// Convert to plain object to avoid Mongoose document internals
		return populatedMessage.toObject() as unknown as PopulatedMessage;
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
