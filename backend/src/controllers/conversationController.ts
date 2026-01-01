import { ConversationService } from "../services/conversatioService";
import type { Request, Response } from "express";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { HandleError } from "../utils/errorHandler";

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
			HandleError(error, res, "ConversationController.createConversation", {
				userId,
				otherUserId,
			});
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
			HandleError(error, res, "ConversationController.getConversations", {
				userId,
			});
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
			HandleError(error, res, "ConversationController.getConversationById", {
				userId,
				conversationId,
			});
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
			HandleError(
				error,
				res,
				"ConversationController.getUserConversationWithAnotherUser",
				{
					userId,
					otherUserId,
				},
			);
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
			HandleError(error, res, "ConversationController.deleteConversation", {
				userId,
				conversationId,
			});
		}
	};
}
