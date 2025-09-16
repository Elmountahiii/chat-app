import { UserRepository } from "../repository/userRepository";
import { UserDocumentType } from "../schema/mongodb/userSchema";
import { UserDataUpdates } from "../schema/user/updateUserInfoSchema";
import { AppError } from "../types/common";
import { TypedEventEmitter } from "../validators/events";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private messageEventEmitter: TypedEventEmitter
  ) {
    this.messageEventEmitter.on("user:statusChanged", async (data) => {
      await this.userRepository.updateUser(data.userId, {
        status: data.newStatus,
      });

      const user = await this.userRepository.findUserById(data.userId);
      if (!user) return;
      const friends = await this.userRepository.getFriends(data.userId);

      // ? broadcast user online status to friends
      this.messageEventEmitter.emit("broadcast:statusChanged", {
        status: data.newStatus, // the connectivity status
        user: user, // the User object
        friends: friends as unknown as UserDocumentType[], // the user's friends that need to be notified
      });
    });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserById(userId: string) {
    return await this.userRepository.findUserById(userId);
  }

  async updateUser(userId: string, updateData: UserDataUpdates) {
    return await this.userRepository.updateUser(userId, updateData);
  }

  async searchUsers(query: string, userId: string) {
    if (query === "") return [];
    return await this.userRepository.searchUsers(query, userId);
  }

  async deleteUser(userId: string) {
    return await this.userRepository.deleteUser(userId);
  }

  async sendFriendRequest(requesterId: string, recipientId: string) {
    return this.userRepository.sendFriendRequest(requesterId, recipientId);
  }

  async acceptFriendRequest(friendshipId: string, userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new AppError("User not found", 404);
    const friendship = await this.userRepository.acceptFriendRequest(
      friendshipId,
      userId
    );
    const friends = await this.userRepository.getFriends(userId);
    this.messageEventEmitter.emit("broadcast:statusChanged", {
      status: "online",
      user: user,
      friends: friends as unknown as UserDocumentType[],
    });

    return friendship;
  }

  async declineFriendRequest(friendshipId: string, userId: string) {
    return this.userRepository.declineFriendRequest(friendshipId, userId);
  }

  async getPendingRequests(userId: string) {
    return this.userRepository.getPendingRequests(userId);
  }

  async getAllFriends(userId: string) {
    return this.userRepository.getFriends(userId);
  }

  async getFriendshipStatus(userId: string, friendId: string) {
    return this.userRepository.getFriendshipStatus(userId, friendId);
  }

  async removeFriend(userId: string, friendId: string) {
    return this.userRepository.removeFriend(userId, friendId);
  }
}
