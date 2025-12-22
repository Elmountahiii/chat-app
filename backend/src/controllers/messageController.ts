import type { Request, Response } from "express";
import { MessageService } from "../services/messageService";
import { HandleError } from "../utils/errorHandler";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { MessageValidator } from "../validators/messageValidator";

export class MessageController {
	constructor(
		private messageService: MessageService,
		private messageValidator: MessageValidator,
	) {}

	getConversationMessages = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.conversationId;
		const cursor = req.query.cursor as string | undefined;
		const limit = req.query.limit
			? parseInt(req.query.limit as string, 10)
			: 30;

		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const paginatedMessages =
				await this.messageService.getConversationMessages(
					conversationId,
					userId,
					cursor,
					limit,
				);
			res.status(200).send(createSuccessResponse(paginatedMessages));
		} catch (error) {
			HandleError(error, res, "MessageController.getConversationMessages", {
				userId,
				conversationId,
			});
		}
	};

	loadInitialMessages = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.conversationId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const messages = await this.messageService.loadInitialMessages(
				conversationId,
				userId,
			);
			res.status(200).send(createSuccessResponse(messages));
		} catch (error) {
			HandleError(error, res, "MessageController.loadInitialMessages", {
				userId,
				conversationId,
			});
		}
	};

	markConversationMessagesAsRead = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.id;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const markReadMessagesData =
				this.messageValidator.validateReadMessagesData({
					conversationId,
				});

			const isRead = await this.messageService.markConversationMessagesAsRead(
				markReadMessagesData.conversationId,
				userId,
			);

			res.status(200).send(createSuccessResponse(isRead));
		} catch (error) {
			HandleError(
				error,
				res,
				"MessageController.markConversationMessagesAsRead",
				{
					userId,
					conversationId,
				},
			);
		}
	};
}
