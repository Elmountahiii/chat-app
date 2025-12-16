import mongoose from "mongoose";
import {
	ConversationModel,
	PopulatedConversation,
} from "../schema/mongodb/conversationSchema";

export class ConversationRepository {
	constructor() {}

	async getUserConversations(userId: string): Promise<PopulatedConversation[]> {
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
			{ $sort: { updatedAt: -1 } },
			{ $project: { unreadMessages: 0 } },
		]);

		return (await ConversationModel.populate(conversations, [
			{ path: "participantOne", select: "-password" },
			{ path: "participantTwo", select: "-password" },
			{
				path: "lastMessage",
				populate: { path: "sender", select: "-password" },
			},
		])) as unknown as PopulatedConversation[];
	}

	async getConversationById(
		id: string,
		userId: string,
	): Promise<PopulatedConversation | null> {
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
			{ $project: { unreadMessages: 0 } },
		]);

		if (conversations.length === 0) return null;

		const populatedConversations = await ConversationModel.populate(
			conversations,
			[
				{ path: "participantOne", select: "-password" },
				{ path: "participantTwo", select: "-password" },
				{
					path: "lastMessage",
					populate: { path: "sender", select: "-password" },
				},
			],
		);

		return populatedConversations[0] as unknown as PopulatedConversation;
	}

	async getUserConversationWithAnotherUser(
		userId: string,
		otherUserId: string,
	): Promise<PopulatedConversation | null> {
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
			{ $project: { unreadMessages: 0 } },
		]);

		if (conversations.length === 0) return null;

		const populatedConversations = await ConversationModel.populate(
			conversations,
			[
				{ path: "participantOne", select: "-password" },
				{ path: "participantTwo", select: "-password" },
				{
					path: "lastMessage",
					populate: { path: "sender", select: "-password" },
				},
			],
		);

		return populatedConversations[0] as unknown as PopulatedConversation;
	}

	async createConversation(
		participantOneId: string,
		participantTwoId: string,
	): Promise<PopulatedConversation> {
		const conversation = new ConversationModel({
			participantOne: participantOneId,
			participantTwo: participantTwoId,
			lastMessage: null,
		});
		await conversation.save();

		const populatedConversation = await conversation.populate([
			{ path: "participantOne", select: "-password" },
			{ path: "participantTwo", select: "-password" },
		]);

		const result =
			populatedConversation.toObject() as unknown as PopulatedConversation;
		result.unreadCount = 0;

		return result;
	}

	async getUserConversationsWithUnreadCounts(
		userId: string,
	): Promise<PopulatedConversation[]> {
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
			{ $sort: { updatedAt: -1 } },
			{ $project: { unreadMessages: 0 } },
		]);

		return (await ConversationModel.populate(conversations, [
			{ path: "participantOne", select: "-password" },
			{ path: "participantTwo", select: "-password" },
			{
				path: "lastMessage",
				populate: { path: "sender", select: "-password" },
			},
		])) as unknown as PopulatedConversation[];
	}

	async deleteConversation(id: string): Promise<boolean> {
		const result = await ConversationModel.findByIdAndDelete(id);
		return result !== null;
	}
}
