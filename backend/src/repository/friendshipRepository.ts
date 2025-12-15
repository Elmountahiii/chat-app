import mongoose from "mongoose";
import {
	FriendshipModel,
	PopulatedFriendship,
} from "../schema/mongodb/friendshipSchema";
import { User, UserModel } from "../schema/mongodb/userSchema";

export class FriendshipRepository {
	constructor() {}

	async getFriendshipById(
		friendshipId: string,
	): Promise<PopulatedFriendship | null> {
		const friendship = (await FriendshipModel.findById(friendshipId)
			.populate("requester")
			.populate("recipient")
			.populate("blockedBy")
			.lean()) as PopulatedFriendship | null;
		return friendship;
	}

	async getFriendsList(userId: string): Promise<User[]> {
		const Friendships = await FriendshipModel.find({
			$or: [{ requester: userId }, { recipient: userId }],
			status: "accepted",
		})

			.lean();
		const friendsId = Friendships.map((friendship) => {
			if (friendship.requester._id.toString() !== userId) {
				return friendship.requester._id.toString();
			} else {
				return friendship.recipient._id.toString();
			}
		});

		const friends = await UserModel.find({
			_id: { $in: friendsId },
		})
			.select("-password")
			.lean();

		return friends;
	}

	async getFriendshipStatus(
		userOneId: string,
		userTwoId: string,
	): Promise<PopulatedFriendship | null> {
		const friendship = (await FriendshipModel.findOne({
			$or: [
				{ requester: userOneId, recipient: userTwoId },
				{ requester: userTwoId, recipient: userOneId },
			],
		})
			.populate("requester", "-password")
			.populate("recipient", "-password")
			.lean()) as PopulatedFriendship | null;
		return friendship;
	}

	async getPendingFriendRequests(userId: string) {
		return (await FriendshipModel.find({
			recipient: userId,
			status: "pending",
		})
			.populate("requester", "-password")
			.populate("recipient", "-password")
			.populate("blockedBy", "-password")
			.sort({ createdAt: -1 })
			.lean()) as unknown as PopulatedFriendship[];
	}

	async getSentFriendRequests(userId: string) {
		return (await FriendshipModel.find({
			requester: userId,
			status: "pending",
		})
			.populate("requester", "-password")
			.populate("recipient", "-password")
			.populate("blockedBy", "-password")
			.sort({ createdAt: -1 })
			.lean()) as unknown as PopulatedFriendship[];
	}

	async sendFriendshipRequest(senderId: string, reciverId: string) {
		const existingFriendship = await this.getFriendshipStatus(
			senderId,
			reciverId,
		);
		if (existingFriendship) {
			throw new Error(
				"Friendship request already exists or users are already friends.",
			);
		}
		const sender = await UserModel.findById(senderId).select("_id").lean();
		const receiver = await UserModel.findById(reciverId).select("_id").lean();
		if (!sender || !receiver) {
			throw new Error("Sender or receiver does not exist.");
		}

		const friendship = new FriendshipModel({
			requester: senderId,
			recipient: reciverId,
			status: "pending",
		});

		await friendship.save();
		await friendship.populate([
			{ path: "requester", select: "-password" },
			{ path: "recipient", select: "-password" },
			{ path: "blockedBy", select: "-password" },
		]);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async acceptFriendShipRequest(userId: string, friendshipId: string) {
		const friendship = await FriendshipModel.findById(friendshipId);
		if (!friendship) {
			throw new Error("Friendship request not found.");
		}
		if (friendship.recipient.toString() !== userId) {
			throw new Error("User is not authorized to accept this request.");
		}
		if (friendship.status !== "pending") {
			throw new Error("Friendship request is not pending.");
		}

		friendship.status = "accepted";
		await friendship.save();
		await friendship.populate([
			{ path: "requester", select: "-password" },
			{ path: "recipient", select: "-password" },
			{ path: "blockedBy", select: "-password" },
		]);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async declineFriendShipRequest(userId: string, friendshipId: string) {
		const friendship = await FriendshipModel.findById(friendshipId);
		if (!friendship) {
			throw new Error("Friendship request not found.");
		}
		if (friendship.recipient.toString() !== userId) {
			throw new Error("User is not authorized to decline this request.");
		}
		if (friendship.status !== "pending") {
			throw new Error("Friendship request is not pending.");
		}

		await FriendshipModel.findByIdAndDelete(friendshipId);

		return;
	}

	async cancelFriendShipRequest(userId: string, friendshipId: string) {
		const friendship = await FriendshipModel.findById(friendshipId);
		if (!friendship) {
			throw new Error("Friendship request not found.");
		}
		if (friendship.requester.toString() !== userId) {
			throw new Error("User is not authorized to cancel this request.");
		}
		if (friendship.status !== "pending") {
			throw new Error("Friendship request is not pending.");
		}
		await FriendshipModel.findByIdAndDelete(friendshipId);
		return;
	}

	async removeFriend(userId: string, friendId: string) {
		const friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: friendId },
				{ requester: friendId, recipient: userId },
			],
			status: "accepted",
		});
		if (!friendship) {
			throw new Error("Friendship not found.");
		}

		await FriendshipModel.findByIdAndDelete(friendship._id);
		return;
	}

	async blockUser(userId: string, friendId: string) {
		const friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: friendId },
				{ requester: friendId, recipient: userId },
			],
		});
		if (!friendship) {
			throw new Error("Friendship not found.");
		}

		friendship.status = "blocked";
		friendship.blockedBy = new mongoose.Types.ObjectId(userId);
		await friendship.save();
		await friendship.populate([
			{ path: "requester", select: "-password" },
			{ path: "recipient", select: "-password" },
			{ path: "blockedBy", select: "-password" },
		]);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async unblockUser(userId: string, friendId: string) {
		const friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: friendId },
				{ requester: friendId, recipient: userId },
			],
			status: "blocked",
		});
		if (!friendship) {
			throw new Error("Friendship not found.");
		}
		if (friendship.blockedBy?.toString() !== userId) {
			throw new Error("User is not authorized to unblock this user.");
		}
		await FriendshipModel.findByIdAndDelete(friendship._id);
		return;
	}
}
