import { ConversationRepository } from "../repository/conversationRepository";
import { FriendshipService } from "./friendsipService";
import { PopulatedConversation } from "../schema/mongodb/conversationSchema";
import { AppError, HttpStatus } from "../types/common";

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

		// Add blocked status to each conversation
		const conversationsWithBlockStatus = await Promise.all(
			conversations.map(async (conv) => {
				const otherUserId =
					conv.participantOne._id.toString() === userId
						? conv.participantTwo._id.toString()
						: conv.participantOne._id.toString();

				const blockStatus = await this.friendshipService.isBlocked(
					userId,
					otherUserId,
				);

				return {
					...conv,
					isBlocked: blockStatus.isBlocked,
					blockedByMe: blockStatus.blockedByUserId === userId,
				} as PopulatedConversation & { isBlocked: boolean; blockedByMe: boolean };
			}),
		);

		return conversationsWithBlockStatus;
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
			throw new AppError(
				"Cannot create conversation with oneself",
				HttpStatus.BAD_REQUEST,
			);
		}
		const areFriends = await this.friendshipService.getFriendshipStatus(
			participantOneId,
			participantTwoId,
		);
		if (!areFriends || areFriends.status !== "accepted") {
			throw new AppError(
				"Users must be friends to create a conversation",
				HttpStatus.FORBIDDEN,
			);
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
