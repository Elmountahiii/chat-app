import { AppError } from "../types/common";
import { UserRepository } from "./userRepository";
import { FriendshipModel } from "../schema/mongodb/friendshipSchema";

export class FriendshipRepository {
  constructor(private userRepository: UserRepository) {}

  async sendFriendRequest(requesterId: string, recipientId: string) {
    const requester = await this.userRepository.findUserById(requesterId);
    const recipient = await this.userRepository.findUserById(recipientId);

    if (!requester || !recipient) {
      throw new AppError("Could not find user", 404);
    }
    const existingFriendship = await FriendshipModel.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        throw new AppError("You are already friends", 400);
      } else if (existingFriendship.status === "pending") {
        throw new AppError("Friend request already sent", 400);
      } else if (existingFriendship.status === "declined") {
        existingFriendship.status = "pending";
        existingFriendship.requester = requester._id;
        existingFriendship.recipient = recipient._id;
        const savedFriendship = await existingFriendship.save();
        return savedFriendship;
      } else {
        throw new AppError("Invalid friendship status", 400);
      }
    } else {
      const friendship = new FriendshipModel({
        requester: requester._id,
        recipient: recipient._id,
        status: "pending",
      });
      const savedFriendship = await friendship.save();
      return savedFriendship;
    }
  }

  async acceptFriendRequest(friendshipId: string, userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const friendship = await FriendshipModel.findOne({
      _id: friendshipId,
      recipient: user._id,
      status: "pending",
    });
    if (!friendship) {
      throw new AppError("Friendship not found", 404);
    }

    friendship.status = "accepted";
    await friendship.save();
    return friendship;
  }

  async declineFriendRequest(friendshipId: string, userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const friendship = await FriendshipModel.findOne({
      _id: friendshipId,
      recipient: user._id,
      status: "pending",
    });
    if (!friendship) {
      throw new AppError("Friendship not found", 404);
    }
    friendship.status = "declined";
    await friendship.save();
    return friendship;
  }

  async removeFriend(userId: string, friendshipId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const friendship = await FriendshipModel.findOne({
      _id: friendshipId,
    });
    if (!friendship) {
      throw new AppError("Friendship not found", 404);
    }
    if (
      friendship.requester.toString() !== userId &&
      friendship.recipient.toString() !== userId
    ) {
      throw new AppError(
        "You are not authorized to remove this friendship",
        403
      );
    }
    if (friendship.status !== "accepted") {
      throw new AppError("You can only remove accepted friendships", 400);
    }

    await friendship.deleteOne();
    return true;
  }

  async getFriends(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const friendships = await FriendshipModel.find({
      $or: [
        { requester: user._id, status: "accepted" },
        { recipient: user._id, status: "accepted" },
      ],
    })
      .populate("requester recipient")
      .lean();

    return friendships.map((friendship) => {
      return friendship.requester._id.equals(user._id)
        ? friendship.recipient
        : friendship.requester;
    });
  }

  async getPendingRequests(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const pendingRequests = await FriendshipModel.find({
      recipient: user._id,
      status: "pending",
    })
      .populate("requester")
      .sort({ createdAt: -1 })
      .lean();
    return pendingRequests.map((request) => ({
      id: request._id,
      requester: request.requester,
      sentAt: request.createdAt,
    }));
  }

  async getSentRequests(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const sentRequests = await FriendshipModel.find({
      requester: user._id,
      status: "pending",
    })
      .populate("recipient")
      .sort({ createdAt: -1 })
      .lean();

    return sentRequests.map((request) => ({
      id: request._id,
      recipient: request.recipient,
      sentAt: request.createdAt,
    }));
  }

  async getFriendshipStatus(userId1: string, userId2: string) {
    const user1 = await this.userRepository.findUserById(userId1);
    const user2 = await this.userRepository.findUserById(userId2);
    if (!user1 || !user2) {
      throw new AppError("User not found", 404);
    }
    const friendship = await FriendshipModel.findOne({
      $or: [
        { requester: user1._id, recipient: user2._id },
        { requester: user2._id, recipient: user1._id },
      ],
    }).lean();
    if (!friendship) {
      return {
        id: null,
        status: "none",
      };
    }

    return {
      id: friendship._id,
      status: friendship.status,
      requester: friendship.requester.toString(),
      recipient: friendship.recipient.toString(),
      isRequester: friendship.requester.toString() === userId1,
    };
  }
}
