import type { Request, Response } from "express";
import { MessageService } from "../services/messageService";
import { HandleError } from "../utils/errorHandler";
import {
  AppError,
  createErrorResponse,
  createSuccessResponse,
} from "../types/common";
import { MessageValidator } from "../validators/messageValidator";
import { TypedEventEmitter } from "../validators/events";
import { UserService } from "../services/userService";

export class MessageController {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private messageValidator: MessageValidator,
    private messageEventEmitter: TypedEventEmitter
  ) {}

  createConversation = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const body = req.body;

    try {
      const conversationCreationData =
        this.messageValidator.validateConversationCreationData(body);
      conversationCreationData.participants.push(userId);
      const conversation = await this.messageService.createConversation(
        conversationCreationData,
        userId
      );
      this.messageEventEmitter.emit("conversation:created", {
        userId: userId,
        conversation: conversation,
        participants: conversationCreationData.participants,
      });
      res.status(201).send(createSuccessResponse(conversation));
    } catch (error) {
      HandleError(error, res, "MessageController.createConversation", {
        userId,
        body,
      });
    }
  };

  getConversations = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { page, limit } = req.query;

    try {
      const conversationFetchParams =
        this.messageValidator.validateConversationFetchParams({
          page,
          limit,
        });
      const conversations = await this.messageService.getConversations(
        userId,
        conversationFetchParams.page,
        conversationFetchParams.limit
      );
      res.status(200).send(createSuccessResponse(conversations));
    } catch (error) {
      HandleError(error, res, "MessageController.getConversations", {
        userId,
        page,
        limit,
      });
    }
  };

  sendMessage = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const conversationId = req.params.id;
    const body = req.body;

    try {
      const messageData =
        this.messageValidator.validateMessageSendingData(body);
      const message = await this.messageService.sendMessage({
        ...messageData,
        senderId: userId,
      });

      this.messageEventEmitter.emit("message:created", {
        conversationId,
        message,
        userId,
      });
      res.status(201).send(createSuccessResponse(message));
    } catch (error) {
      HandleError(error, res, "MessageController.sendMessage", {
        userId,
        conversationId,
        body,
      });
    }
  };

  getConversationMessages = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const conversationId = req.params.id;
    const { cursor, limit } = req.query;

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
        fetchMessagesData.limit
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
    const userId = req.headers["user-id"] as string;
    const conversationId = req.params.id;

    try {
      const markReadMessagesData =
        this.messageValidator.validateReadMessagesData({
          conversationId,
        });

      const readData = await this.messageService.markConversationMessagesAsRead(
        markReadMessagesData.conversationId,
        userId
      );
      const user = await this.userService.findUserById(userId);
      if (!user) {
        res.status(404).send(createErrorResponse("User not found"));
        return;
      }
      this.messageEventEmitter.emit("message:read", {
        conversationId,
        messageId: readData.targetMessage.id.toString(),
        totalUnreadMessagesCleared: readData.totalUnreadMessagesCleared,
        user,
        lastReadAt: readData.lastReadAt,
      });
      res.status(200).send(createSuccessResponse(readData));
    } catch (error) {
      HandleError(
        error,
        res,
        "MessageController.markConversationMessagesAsRead",
        {
          userId,
          conversationId,
        }
      );
    }
  };
}
