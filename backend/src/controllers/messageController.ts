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

		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const messages = await this.messageService.getConversationMessages(
				conversationId,
				userId,
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
