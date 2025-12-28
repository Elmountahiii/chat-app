import { FriendshipRepository } from "../repository/friendshipRepository";

export class FriendshipService {
	constructor(private firendshipRepo: FriendshipRepository) {}

	async getFriendshipById(friendshipId: string) {
		const friendship =
			await this.firendshipRepo.getFriendshipById(friendshipId);
		return friendship;
	}
	async getFriendsList(userId: string) {
		const friends = await this.firendshipRepo.getFriendsList(userId);
		return friends;
	}

	async getFriendshipStatus(userOneId: string, userTwoId: string) {
		const friendship = await this.firendshipRepo.getFriendshipStatus(
			userOneId,
			userTwoId,
		);
		return friendship;
	}

	async getPendingFriendRequests(userId: string) {
		const requests = await this.firendshipRepo.getPendingFriendRequests(userId);
		return requests;
	}

	async getSentFriendRequests(userId: string) {
		const requests = await this.firendshipRepo.getSentFriendRequests(userId);
		return requests;
	}

	async sendFriendshipRequest(senderId: string, reciverId: string) {
		if (senderId === reciverId) {
			throw new Error("Cannot send friend request to oneself");
		}
		const friendship = await this.firendshipRepo.sendFriendshipRequest(
			senderId,
			reciverId,
		);
		return friendship;
	}

	async accepetFriendshipRequest(userId: string, friendshipId: string) {
		const friendship = await this.firendshipRepo.acceptFriendShipRequest(
			userId,
			friendshipId,
		);
		return friendship;
	}

	async declineFriendshipRequest(userId: string, friendshipId: string) {
		const result = await this.firendshipRepo.declineFriendShipRequest(
			userId,
			friendshipId,
		);
		return result;
	}

	async cancelFriendShipRequest(userId: string, friendshipId: string) {
		const result = await this.firendshipRepo.cancelFriendShipRequest(
			userId,
			friendshipId,
		);
		return result;
	}

	async removeFriend(userId: string, friendId: string) {
		const result = await this.firendshipRepo.removeFriend(userId, friendId);
		return result;
	}

	async isBlocked(userOneId: string, userTwoId: string) {
		return await this.firendshipRepo.isBlocked(userOneId, userTwoId);
	}

	async blockUser(userId: string, friendId: string) {
		if (userId === friendId) {
			throw new Error("Cannot block oneself");
		}
		const result = await this.firendshipRepo.blockUser(userId, friendId);
		return result;
	}

	async unblockUser(userId: string, friendId: string) {
		const result = await this.firendshipRepo.unblockUser(userId, friendId);
		return result;
	}
}
