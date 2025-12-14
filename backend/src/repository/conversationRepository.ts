import mongoose from "mongoose";
import { ConversationModel } from "../schema/mongodb/conversationSchema";
import { PopulatedMessage } from "../schema/mongodb/messageSchema";
import { User } from "../schema/mongodb/userSchema";

export type ConversationWithDetails = {
	_id: mongoose.Types.ObjectId;
	participantOne: User;
	participantTwo: User;
	lastMessage?: PopulatedMessage;
	unreadCount: number;
	createdAt: Date;
	updatedAt: Date;
};

export class ConversationRepository {
	constructor() {}

	async getUserConversations(
		userId: string,
	): Promise<ConversationWithDetails[]> {
		const conversations = await ConversationModel.aggregate([
			{
				$match: {
					$or: [
						{ participantOne: new mongoose.Types.ObjectId(userId) },
						{ participantTwo: new mongoose.Types.ObjectId(userId) },
					],
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { convId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$conversationId", "$$convId"] },
								"readBy.user": { $ne: new mongoose.Types.ObjectId(userId) },
							},
						},
						{ $count: "count" },
					],
					as: "unreadMessages",
				},
			},
			{
				$addFields: {
					unreadCount: {
						$ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
					},
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantOne" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantOne",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantTwo" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantTwo",
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { lastMsgId: "$lastMessage" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$lastMsgId"] } } },
						{
							$lookup: {
								from: "users",
								let: { senderId: "$sender" },
								pipeline: [
									{ $match: { $expr: { $eq: ["$_id", "$$senderId"] } } },
									{
										$project: {
											password: 0,
										},
									},
								],
								as: "sender",
							},
						},
						{ $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
					],
					as: "lastMessage",
				},
			},
			{
				$unwind: { path: "$participantOne", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$participantTwo", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
			},
			{ $sort: { updatedAt: -1 } },
			{ $project: { unreadMessages: 0 } },
		]);

		return conversations as ConversationWithDetails[];
	}

	async getConversationById(
		id: string,
		userId: string,
	): Promise<ConversationWithDetails | null> {
		const conversations = await ConversationModel.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { convId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$conversationId", "$$convId"] },
								"readBy.user": { $ne: new mongoose.Types.ObjectId(userId) },
							},
						},
						{ $count: "count" },
					],
					as: "unreadMessages",
				},
			},
			{
				$addFields: {
					unreadCount: {
						$ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
					},
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantOne" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantOne",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantTwo" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantTwo",
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { lastMsgId: "$lastMessage" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$lastMsgId"] } } },
						{
							$lookup: {
								from: "users",
								let: { senderId: "$sender" },
								pipeline: [
									{ $match: { $expr: { $eq: ["$_id", "$$senderId"] } } },
									{
										$project: {
											password: 0,
										},
									},
								],
								as: "sender",
							},
						},
						{ $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
					],
					as: "lastMessage",
				},
			},
			{
				$unwind: { path: "$participantOne", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$participantTwo", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
			},
			{ $project: { unreadMessages: 0 } },
		]);

		return conversations.length > 0
			? (conversations[0] as ConversationWithDetails)
			: null;
	}

	async getUserConversationWithAnotherUser(
		userId: string,
		otherUserId: string,
	): Promise<ConversationWithDetails | null> {
		const conversations = await ConversationModel.aggregate([
			{
				$match: {
					$or: [
						{
							participantOne: new mongoose.Types.ObjectId(userId),
							participantTwo: new mongoose.Types.ObjectId(otherUserId),
						},
						{
							participantOne: new mongoose.Types.ObjectId(otherUserId),
							participantTwo: new mongoose.Types.ObjectId(userId),
						},
					],
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { convId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$conversationId", "$$convId"] },
								"readBy.user": { $ne: new mongoose.Types.ObjectId(userId) },
							},
						},
						{ $count: "count" },
					],
					as: "unreadMessages",
				},
			},
			{
				$addFields: {
					unreadCount: {
						$ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
					},
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantOne" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantOne",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantTwo" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantTwo",
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { lastMsgId: "$lastMessage" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$lastMsgId"] } } },
						{
							$lookup: {
								from: "users",
								let: { senderId: "$sender" },
								pipeline: [
									{ $match: { $expr: { $eq: ["$_id", "$$senderId"] } } },
									{
										$project: {
											password: 0,
										},
									},
								],
								as: "sender",
							},
						},
						{ $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
					],
					as: "lastMessage",
				},
			},
			{
				$unwind: { path: "$participantOne", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$participantTwo", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
			},
			{ $project: { unreadMessages: 0 } },
		]);

		return conversations.length > 0
			? (conversations[0] as ConversationWithDetails)
			: null;
	}

	async createConversation(
		participantOneId: string,
		participantTwoId: string,
	): Promise<ConversationWithDetails> {
		const conversation = new ConversationModel({
			participantOne: participantOneId,
			participantTwo: participantTwoId,
		});
		await conversation.save();

		const conversations = await ConversationModel.aggregate([
			{
				$match: {
					_id: conversation._id,
				},
			},
			{
				$addFields: {
					unreadCount: 0,
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantOne" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantOne",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantTwo" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantTwo",
				},
			},
			{
				$unwind: { path: "$participantOne", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$participantTwo", preserveNullAndEmptyArrays: true },
			},
		]);

		return conversations[0] as ConversationWithDetails;
	}

	async getUserConversationsWithUnreadCounts(
		userId: string,
	): Promise<ConversationWithDetails[]> {
		const conversations = await ConversationModel.aggregate([
			{
				$match: {
					$or: [
						{ participantOne: new mongoose.Types.ObjectId(userId) },
						{ participantTwo: new mongoose.Types.ObjectId(userId) },
					],
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { convId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$conversationId", "$$convId"] },
								"readBy.user": { $ne: new mongoose.Types.ObjectId(userId) },
							},
						},
						{ $count: "count" },
					],
					as: "unreadMessages",
				},
			},
			{
				$addFields: {
					unreadCount: {
						$ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
					},
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantOne" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantOne",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { participantId: "$participantTwo" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$participantId"] } } },
						{
							$project: {
								password: 0,
							},
						},
					],
					as: "participantTwo",
				},
			},
			{
				$lookup: {
					from: "messages",
					let: { lastMsgId: "$lastMessage" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$lastMsgId"] } } },
						{
							$lookup: {
								from: "users",
								let: { senderId: "$sender" },
								pipeline: [
									{ $match: { $expr: { $eq: ["$_id", "$$senderId"] } } },
									{
										$project: {
											password: 0,
										},
									},
								],
								as: "sender",
							},
						},
						{ $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
					],
					as: "lastMessage",
				},
			},
			{
				$unwind: { path: "$participantOne", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$participantTwo", preserveNullAndEmptyArrays: true },
			},
			{
				$unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
			},
			{ $sort: { updatedAt: -1 } },
			{ $project: { unreadMessages: 0 } },
		]);

		return conversations as ConversationWithDetails[];
	}

	async deleteConversation(id: string): Promise<boolean> {
		const result = await ConversationModel.findByIdAndDelete(id);
		return result !== null;
	}
}
