import { UserDocumentType, UserModel } from "../schema/mongodb/userSchema";
import { PROFILE_PICTURE_LIST } from "../types/constants";
import {
	FriendshipDocumentType,
	FriendshipModel,
} from "../schema/mongodb/friendshipSchema";
import type { UserDataUpdates } from "../schema/user/updateUserInfoSchema";
import { AppError } from "../types/common";

export class UserRepository {
	constructor() {}

	async createUser(
		username: string,
		firstName: string,
		lastName: string,
		email: string,
		password: string,
	) {
		const randomIndex = Math.floor(Math.random() * PROFILE_PICTURE_LIST.length);
		const user = new UserModel({
			username,
			firstName,
			lastName,
			email,
			password,
			profilePicture: PROFILE_PICTURE_LIST[randomIndex],
		});
		const savedUser = await user.save();
		return savedUser;
	}

	async findUserByEmail(email: string) {
		return await UserModel.findOne({ email }).select("-password").lean();
	}
	async findUserByEmailWithPassword(email: string) {
		return await UserModel.findOne({ email }).lean();
	}
	async findUserById(userId: string) {
		return await UserModel.findById(userId).select("-password").lean();
	}

	async findByUserName(username: string) {
		return await UserModel.findOne({ username }).select("-password").lean();
	}

	async updateUser(userId: string, updateData: UserDataUpdates) {
		return await UserModel.findByIdAndUpdate(userId, updateData, {
			new: true,
		})
			.select("-password")
			.lean();
	}

	async deleteUser(userId: string) {
		return await UserModel.findByIdAndDelete(userId).select("-password").lean();
	}
	async getAllUsers() {
		return await UserModel.find({}).select("-password").lean();
	}

	async searchUsers(query: string, userId: string) {
		const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(escaped, "i");

		const users = await UserModel.find({
			$or: [
				{ username: regex },
				{ firstName: regex },
				{ lastName: regex },
				{ email: regex },
			],
		})
			.select("-password")
			.lean();

		const otherUsers = users.filter(
			(u: UserDocumentType) => u._id.toString() !== userId,
		);
		if (otherUsers.length === 0) return [];

		const orClauses = otherUsers.flatMap((u: UserDocumentType) => [
			{ requester: userId, recipient: u._id },
			{ requester: u._id, recipient: userId },
		]);

		const friendships = await FriendshipModel.find({ $or: orClauses }).lean();

		const friendshipMap = new Map<string, FriendshipDocumentType>();
		friendships.forEach((f: FriendshipDocumentType) => {
			const requesterId = f.requester.toString();
			const recipientId = f.recipient.toString();
			const otherId = requesterId === userId ? recipientId : requesterId;
			friendshipMap.set(otherId, f);
		});

		return otherUsers.map((u: UserDocumentType) => {
			const f = friendshipMap.get(u._id.toString());
			if (!f) {
				return { ...u, friendship: { id: null, status: "none" } };
			}
			return {
				...u,
				friendship: {
					id: f._id,
					status: f.status,
					requester: f.requester.toString(),
					recipient: f.recipient.toString(),
					isRequester: f.requester.toString() === userId,
				},
			};
		});
	}

	async sendFriendRequest(requesterId: string, recipientId: string) {
		const requester = await this.findUserById(requesterId);
		const recipient = await this.findUserById(recipientId);

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
			const savedFriendship = (await friendship.save()).populate(
				"requester recipient",
			);
			return savedFriendship;
		}
	}

	async acceptFriendRequest(friendshipId: string, userId: string) {
		const user = await this.findUserById(userId);
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
		return await friendship.populate(["requester", "recipient"]);
	}

	async declineFriendRequest(friendshipId: string, userId: string) {
		const user = await this.findUserById(userId);
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
		return await friendship.populate(["requester", "recipient"]);
	}

	async removeFriend(userId: string, friendshipId: string) {
		const user = await this.findUserById(userId);
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
				403,
			);
		}
		if (friendship.status !== "accepted") {
			throw new AppError("You can only remove accepted friendships", 400);
		}

		await friendship.deleteOne();
		return true;
	}

	async getFriends(userId: string) {
		const user = await this.findUserById(userId);
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
			return friendship.requester._id.toString() === user._id.toString()
				? friendship.recipient
				: friendship.requester;
		});
	}

	async getPendingRequests(userId: string) {
		const user = await this.findUserById(userId);
		if (!user) {
			throw new AppError("User not found", 404);
		}
		const pendingRequests = await FriendshipModel.find({
			recipient: user._id,
			status: "pending",
		})
			.populate(["requester", "recipient"])
			.sort({ createdAt: -1 })
			.lean();

		return pendingRequests;
	}

	async getSentRequests(userId: string) {
		const user = await this.findUserById(userId);
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
		const user1 = await this.findUserById(userId1);
		const user2 = await this.findUserById(userId2);
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
