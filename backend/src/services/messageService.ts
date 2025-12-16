import { MessageRepository } from "../repository/messageRepository";
import { AppError } from "../types/common";
import { CreateMessageInput } from "../types/inputs/messagingInputs";
import { ConversationService } from "./conversatioService";

export class MessageService {
	constructor(
		private messageRepo: MessageRepository,
		private conversationService: ConversationService,
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
		limit: number = 50,
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
