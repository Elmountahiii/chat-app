import { ConversationService } from "../services/conversatioService";
import type { Request, Response } from "express";
import { createErrorResponse, createSuccessResponse } from "../types/common";

export class ConversationController {
	constructor(private conversationService: ConversationService) {}

	createConversation = async (req: Request, res: Response) => {
		const userId = req.userId;
		const otherUserId = req.params.otherUserId;
		if (!userId) {
			res.status(401).send(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const conversation = await this.conversationService.createConversation(
				userId,
				otherUserId,
			);
			res
				.status(201)
				.send(
					createSuccessResponse(
						conversation,
						"Conversation created successfully",
					),
				);
		} catch (error) {
			console.error("Error creating new converstation: ", error);
			res
				.status(500)
				.send(createErrorResponse("Failed to create conversation"));
		}
	};

	getConversations = async (req: Request, res: Response) => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).send(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const conversations =
				await this.conversationService.getUserConversationsWithUnreadCounts(
					userId,
				);
			res
				.status(200)
				.send(
					createSuccessResponse(
						conversations,
						"Conversations retrieved successfully",
					),
				);
		} catch (error) {
			console.error("ConversationController.getConversations error:", error, {
				userId,
			});
			res.status(500).send(createErrorResponse("Failed to get conversations"));
		}
	};

	getConversationById = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.conversationId;
		if (!userId) {
			res.status(401).send(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const conversation = await this.conversationService.getConversationById(
				conversationId,
				userId,
			);
			if (!conversation) {
				res.status(404).send(createErrorResponse("Conversation not found"));
				return;
			}

			if (
				conversation.participantOne._id.toString() != userId &&
				conversation.participantTwo._id.toString() != userId
			) {
				res
					.status(403)
					.send(createErrorResponse("Access denied to this conversation"));
				return;
			}
			res
				.status(200)
				.send(
					createSuccessResponse(
						conversation,
						"conversation retrieved successfully",
					),
				);
		} catch (error) {
			console.error("Error getting getConversationById : ", error);
			res.status(500).send(createErrorResponse("Failed to get conversation"));
		}
	};

	getUserConversationWithAnotherUser = async (req: Request, res: Response) => {
		const userId = req.userId;
		const otherUserId = req.params.otherUserId;
		if (!userId) {
			res.status(401).send(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const conversation =
				await this.conversationService.getUserConversationWithAnotherUser(
					userId,
					otherUserId,
				);
			if (!conversation) {
				res.status(404).send(createErrorResponse("Conversation not found"));
				return;
			}
			res
				.status(200)
				.send(
					createSuccessResponse(
						conversation,
						"conversation retrieved successfully",
					),
				);
		} catch (error) {
			console.error(
				"Error getting getUserConversationWithAnotherUser : ",
				error,
			);
			res.status(500).send(createErrorResponse("Failed to get conversation"));
		}
	};

	deleteConversation = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.conversationId;
		if (!userId) {
			res.status(401).send(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const conversation = await this.conversationService.getConversationById(
				conversationId,
				userId,
			);
			if (!conversation) {
				res.status(404).send(createErrorResponse("Conversation not found"));
				return;
			}

			if (
				conversation.participantOne._id.toString() != userId &&
				conversation.participantTwo._id.toString() != userId
			) {
				res
					.status(403)
					.send(createErrorResponse("Access denied to this conversation"));
				return;
			}

			await this.conversationService.deleteConversation(conversationId);
			res
				.status(200)
				.send(createSuccessResponse(null, "Conversation deleted successfully"));
		} catch (error) {
			console.error("Error deleting conversation: ", error);
			res
				.status(500)
				.send(createErrorResponse("Failed to delete conversation"));
		}
	};
}
