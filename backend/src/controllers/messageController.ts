import type { Request, Response } from "express";
import { MessageService } from "../services/messageService";
import { MessageValidator } from "../validators/messageValidator";
import { HandleError } from "../utils/errorHandler";
import { createSuccessResponse } from "../types/common";

export class MessageController {
  constructor(
    private messageService: MessageService,
    private messageValidator: MessageValidator
  ) {}

  sendMessage = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const body = req.body;
    try {
      const validated = this.messageValidator.validateMessage(body);
      await this.messageService.sendMessage(
        userId,
        validated.recipientId,
        validated.content
      );
      res.status(201).send(createSuccessResponse("Message sent successfully"));
    } catch (error) {
      HandleError(error, res, "MessageController.sendMessage", {
        userId,
        body,
      });
    }
  };

  getMessageHistory = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { friendId } = req.params;
    try {
      const messages = await this.messageService.getMessageHistory(
        userId,
        friendId
      );
      res.json(createSuccessResponse(messages));
    } catch (error) {
      HandleError(error, res, "MessageController.getMessageHistory", {
        userId,
        friendId,
      });
    }
  };
}
