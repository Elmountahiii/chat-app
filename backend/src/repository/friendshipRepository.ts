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
			.populate("requester")
			.populate("recipient")
			.lean()) as PopulatedFriendship | null;
		return friendship;
	}

	async getPendingFriendRequests(userId: string) {
		return (await FriendshipModel.find({
			recipient: userId,
			status: "pending",
		})
			.populate("requester")
			.populate("recipient")
			.populate("blockedBy")
			.sort({ createdAt: -1 })
			.lean()) as unknown as PopulatedFriendship[];
	}

	async getSentFriendRequests(userId: string) {
		return (await FriendshipModel.find({
			requester: userId,
			status: "pending",
		})
			.populate("requester")
			.populate("recipient")
			.populate("blockedBy")
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
			{ path: "requester" },
			{ path: "recipient" },
			{ path: "blockedBy" },
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
			{ path: "requester" },
			{ path: "recipient" },
			{ path: "blockedBy" },
		]);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async declineFriendShipRequest(userId: string, friendshipId: string) {
		const friendship = (await FriendshipModel.findById(friendshipId)
			.populate(["requester", "recipient", "blockedBy"])
			.lean()) as PopulatedFriendship | null;
		if (!friendship) {
			throw new Error("Friendship request not found.");
		}
		if (friendship.recipient._id.toString() !== userId) {
			throw new Error("User is not authorized to decline this request.");
		}
		if (friendship.status !== "pending") {
			throw new Error("Friendship request is not pending.");
		}

		await FriendshipModel.findByIdAndDelete(friendshipId);

		return friendship;
	}

	async cancelFriendShipRequest(userId: string, friendshipId: string) {
		const friendship = (await FriendshipModel.findById(friendshipId)
			.populate(["requester", "recipient", "blockedBy"])
			.lean()) as PopulatedFriendship | null;
		if (!friendship) {
			throw new Error("Friendship request not found.");
		}
		if (friendship.requester._id.toString() !== userId) {
			throw new Error("User is not authorized to cancel this request.");
		}
		if (friendship.status !== "pending") {
			throw new Error("Friendship request is not pending.");
		}

		await FriendshipModel.findByIdAndDelete(friendshipId);

		return friendship;
	}

	async removeFriend(userId: string, friendId: string) {
		const friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: friendId },
				{ requester: friendId, recipient: userId },
			],
			status: "accepted",
		})
			.populate("requester")
			.populate("recipient")
			.populate("blockedBy");

		if (!friendship) {
			throw new Error("Friendship not found.");
		}

		await FriendshipModel.findByIdAndDelete(friendship._id);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async isBlocked(
		userOneId: string,
		userTwoId: string,
	): Promise<{ isBlocked: boolean; blockedByUserId: string | null }> {
		const friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userOneId, recipient: userTwoId },
				{ requester: userTwoId, recipient: userOneId },
			],
			status: "blocked",
		});

		if (!friendship) {
			return { isBlocked: false, blockedByUserId: null };
		}

		return {
			isBlocked: true,
			blockedByUserId: friendship.blockedBy?.toString() || null,
		};
	}

	async blockUser(userId: string, blockedUserId: string) {
		// Find any existing friendship/block record
		let friendship = await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: blockedUserId },
				{ requester: blockedUserId, recipient: userId },
			],
		});

		if (friendship) {
			// Update existing record to blocked
			friendship.status = "blocked";
			friendship.blockedBy = new mongoose.Types.ObjectId(userId);
		} else {
			// Create new blocked record (for blocking non-friends)
			friendship = new FriendshipModel({
				requester: userId,
				recipient: blockedUserId,
				status: "blocked",
				blockedBy: userId,
			});
		}

		await friendship.save();
		await friendship.populate([
			{ path: "requester" },
			{ path: "recipient" },
			{ path: "blockedBy" },
		]);

		return friendship.toObject() as unknown as PopulatedFriendship;
	}

	async unblockUser(userId: string, friendId: string) {
		const friendship = (await FriendshipModel.findOne({
			$or: [
				{ requester: userId, recipient: friendId },
				{ requester: friendId, recipient: userId },
			],
			status: "blocked",
		})
			.populate("requester")
			.populate("recipient")
			.populate("blockedBy")) as PopulatedFriendship | null;
		if (!friendship) {
			throw new Error("Friendship not found.");
		}

		if (friendship.blockedBy?._id.toString() !== userId) {
			throw new Error("User is not authorized to unblock this user.");
		}
		await FriendshipModel.findByIdAndDelete(friendship._id);

		return friendship;
	}
}
