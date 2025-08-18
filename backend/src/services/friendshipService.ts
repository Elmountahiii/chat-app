import { FriendshipRepository } from "../repository/friendshipRepository";

export class FriendshipService {
  constructor(private friendshipRepository: FriendshipRepository) {}

  async sendFriendRequest(requesterId: string, recipientId: string) {
    return this.friendshipRepository.sendFriendRequest(
      requesterId,
      recipientId
    );
  }

  async acceptFriendRequest(friendshipId: string, userId: string) {
    return this.friendshipRepository.acceptFriendRequest(friendshipId, userId);
  }

  async declineFriendRequest(friendshipId: string, userId: string) {
    return this.friendshipRepository.declineFriendRequest(friendshipId, userId);
  }

  async getPendingRequests(userId: string) {
    return this.friendshipRepository.getPendingRequests(userId);
  }

  async getAllFriends(userId: string) {
    return this.friendshipRepository.getFriends(userId);
  }

  async getFriendshipStatus(userId: string, friendId: string) {
    return this.friendshipRepository.getFriendshipStatus(userId, friendId);
  }

  async removeFriend(userId: string, friendId: string) {
    return this.friendshipRepository.removeFriend(userId, friendId);
  }
}
