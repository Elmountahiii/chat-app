import { ConversationRepository } from "../repository/conversationRepository";
import { FriendshipService } from "./friendsipService";

export class ConversationService {
	constructor(
		private conversationRepo: ConversationRepository,
		private friendshipService: FriendshipService,
	) {}

	async getUserConversations(userId: string) {
		const conversations =
			await this.conversationRepo.getUserConversations(userId);
		return conversations;
	}

	async getUserConversationsWithUnreadCounts(userId: string) {
		const conversations =
			await this.conversationRepo.getUserConversationsWithUnreadCounts(userId);
		return conversations;
	}

	async getConversationById(id: string, userId: string) {
		const conversation = await this.conversationRepo.getConversationById(
			id,
			userId,
		);
		return conversation;
	}

	async getUserConversationWithAnotherUser(
		userId: string,
		otherUserId: string,
	) {
		const conversation =
			await this.conversationRepo.getUserConversationWithAnotherUser(
				userId,
				otherUserId,
			);
		return conversation;
	}

	async createConversation(participantOneId: string, participantTwoId: string) {
		if (participantOneId === participantTwoId) {
			throw new Error("Cannot create conversation with oneself");
		}
		const areFriends = await this.friendshipService.getFriendshipStatus(
			participantOneId,
			participantTwoId,
		);
		if (!areFriends || areFriends.status !== "accepted") {
			throw new Error("Users must be friends to create a conversation");
		}
		const existingConversations = await this.getUserConversationWithAnotherUser(
			participantOneId,
			participantTwoId,
		);
		if (existingConversations) {
			return existingConversations;
		}
		const conversation = await this.conversationRepo.createConversation(
			participantOneId,
			participantTwoId,
		);
		return conversation;
	}

	async deleteConversation(conversationId: string) {
		const result =
			await this.conversationRepo.deleteConversation(conversationId);
		return result;
	}
}
