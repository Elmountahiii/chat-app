import type { Request, Response } from "express";
import { MessageService } from "../services/messageService";
import { HandleError } from "../utils/errorHandler";
import {
	AppError,
	createErrorResponse,
	createSuccessResponse,
} from "../types/common";
import { MessageValidator } from "../validators/messageValidator";

export class MessageController {
	constructor(
		private messageService: MessageService,
		private messageValidator: MessageValidator,
	) {}

	getConversationMessages = async (req: Request, res: Response) => {
		const userId = req.userId;
		const conversationId = req.params.conversationId;
		const { cursor, limit } = req.query;

		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const limitNum = parseInt(limit as string, 10);
			if (isNaN(limitNum) || limitNum < 1) {
				throw new AppError("Invalid limit: must be a positive integer", 400);
			}
			const fetchMessagesData =
				this.messageValidator.validateConversationMessagesFetchParams({
					conversationId,
					cursor: cursor,
					limit: limitNum,
				});
			const messages = await this.messageService.getConversationMessages(
				fetchMessagesData.conversationId,
				userId,
				fetchMessagesData.cursor,
				fetchMessagesData.limit,
			);
			res.status(200).send(createSuccessResponse(messages));
		} catch (error) {
			HandleError(error, res, "MessageController.getConversationMessages", {
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
