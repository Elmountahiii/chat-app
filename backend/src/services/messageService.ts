import { MessageRepository } from "../repository/messageRepository";
import { AppError } from "../types/common";
import { CreateMessageInput } from "../types/inputs/messagingInputs";
import { ConversationService } from "./conversatioService";
import { FriendshipService } from "./friendsipService";

export class MessageService {
	constructor(
		private messageRepo: MessageRepository,
		private conversationService: ConversationService,
		private friendshipService: FriendshipService,
	) {}

	async sendMessage(input: CreateMessageInput) {
		const { conversationId, content, senderId } = input;
		const conversation = await this.conversationService.getConversationById(
			conversationId,
			senderId,
		);
		if (!conversation) {
			throw new AppError("Conversation not found", 404);
		}

		if (
			conversation.participantOne._id.toString() !== senderId &&
			conversation.participantTwo._id.toString() !== senderId
		) {
			throw new AppError(
				"Sender is not a participant of the conversation",
				403,
			);
		}

		// Check if either user has blocked the other
		const otherUserId =
			conversation.participantOne._id.toString() === senderId
				? conversation.participantTwo._id.toString()
				: conversation.participantOne._id.toString();

		const blockStatus = await this.friendshipService.isBlocked(
			senderId,
			otherUserId,
		);
		if (blockStatus.isBlocked) {
			throw new AppError("You cannot message this user", 403);
		}

		const message = await this.messageRepo.sendMessage({
			conversationId,
			content,
			senderId,
		});

		return message;
	}

	async getConversationMessages(
		conversationId: string,
		userId: string,
		cursor?: string,
		limit: number = 30,
	) {
		const conversation = await this.conversationService.getConversationById(
			conversationId,
			userId,
		);
		if (!conversation) {
			throw new AppError("Conversation not found", 404);
		}
		if (
			conversation.participantOne._id.toString() !== userId &&
			conversation.participantTwo._id.toString() !== userId
		) {
			throw new AppError("User is not a participant of the conversation", 403);
		}
		const messages = await this.messageRepo.getConversationMessages(
			conversationId,
			cursor,
			limit,
		);

		// The repository fetches limit + 1 to check if there are more messages
		const hasMore = messages.length > limit;
		const paginatedMessages = hasMore ? messages.slice(1) : messages;
		const nextCursor = hasMore ? paginatedMessages[0]?._id?.toString() : null;

		return {
			messages: paginatedMessages,
			hasMore,
			nextCursor,
		};
	}

	async loadInitialMessages(conversationId: string, userId: string) {
		const conversation = await this.conversationService.getConversationById(
			conversationId,
			userId,
		);
		if (!conversation) {
			throw new AppError("Conversation not found", 404);
		}

		if (
			conversation.participantOne._id.toString() !== userId &&
			conversation.participantTwo._id.toString() !== userId
		) {
			throw new AppError("User is not a participant of the conversation", 403);
		}
		const messages = await this.messageRepo.loadInitialMessages(
			userId,
			conversationId,
		);
		return messages;
	}

	async markConversationMessagesAsRead(conversationId: string, userId: string) {
		const conversation = await this.conversationService.getConversationById(
			conversationId,
			userId,
		);
		if (!conversation) {
			throw new AppError("Conversation not found", 404);
		}

		if (
			conversation.participantOne._id.toString() !== userId &&
			conversation.participantTwo._id.toString() !== userId
		) {
			throw new AppError("User is not a participant of the conversation", 403);
		}
		const readData = await this.messageRepo.markConversationMessagesAsRead(
			conversationId,
			userId,
		);
		return readData;
	}

	async getUnreadCount(conversationId: string, userId: string) {
		return await this.messageRepo.getUnreadCount(conversationId, userId);
	}
}
