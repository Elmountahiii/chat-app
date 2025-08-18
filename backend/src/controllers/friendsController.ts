import type { Request, Response } from "express";
import { FriendshipService } from "../services/friendshipService";
import { UserService } from "../services/userService";
import {
  AppError,
  createErrorResponse,
  createSuccessResponse,
} from "../types/common";
import { logger } from "../config/logger";

export class FriendshipController {
  constructor(
    private friendshipService: FriendshipService,
    private userService: UserService
  ) {}

  private handleError(
    error: unknown,
    res: Response,
    context: string,
    data?: Record<string, any>
  ): void {
    if (error instanceof AppError) {
      logger.error(`${context} - AppError:`, {
        message: error.message,
        statusCode: error.statusCode,
        ...data,
      });
      res.status(error.statusCode).json(createErrorResponse(error.message));
    } else if (error instanceof Error) {
      logger.error(`${context} - Error:`, {
        message: error.message,
        stack: error.stack,
        ...data,
      });
      res.status(500).json(createErrorResponse("Internal server error"));
    } else {
      logger.error(`${context} - Unknown error:`, {
        error: String(error),
        ...data,
      });
      res.status(500).json(createErrorResponse("Internal server error"));
    }
  }

  sendRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { receiverId } = req.body as { receiverId: string };

    try {
      const friendship = await this.friendshipService.sendFriendRequest(
        userId,
        receiverId
      );
      res.status(201).json(createSuccessResponse(friendship));
    } catch (error) {
      this.handleError(error, res, "Failed to send friend request", {
        userId,
        receiverId,
      });
    }
  };

  acceptRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { friendshipId } = req.body as { friendshipId: string };

    try {
      const friendship = await this.friendshipService.acceptFriendRequest(
        friendshipId,
        userId
      );
      res.status(200).json(createSuccessResponse(friendship));
    } catch (error) {
      this.handleError(error, res, "Failed to accept friend request", {
        userId,
        friendshipId,
      });
    }
  };

  declineRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { friendshipId } = req.body as { friendshipId: string };

    try {
      const friendship = await this.friendshipService.declineFriendRequest(
        friendshipId,
        userId
      );
      res.status(200).json(createSuccessResponse(friendship));
    } catch (error) {
      this.handleError(error, res, "Failed to decline friend request", {
        userId,
        friendshipId,
      });
    }
  };

  getPendingRequests = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;

    try {
      const requests = await this.friendshipService.getPendingRequests(userId);
      res.status(200).json(createSuccessResponse(requests));
    } catch (error) {
      this.handleError(error, res, "Failed to get friend requests", {
        userId,
      });
    }
  };

  searchUsers = async (req: Request, res: Response) => {
    const searchQuery = req.query.query as string;
    const userId = req.headers["user-id"] as string;

    try {
      const results = await this.userService.searchUsers(searchQuery, userId);
      res.status(200).json(createSuccessResponse(results));
    } catch (error) {
      this.handleError(error, res, "Failed to search users", {
        searchQuery,
        userId,
      });
    }
  };

  getAllFriends = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;

    try {
      const friends = await this.friendshipService.getAllFriends(userId);
      res.status(200).json(createSuccessResponse(friends));
    } catch (error) {
      this.handleError(error, res, "Failed to get friends", {
        userId,
      });
    }
  };

  getFriendshipStatus = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { friendId } = req.params;

    try {
      const status = await this.friendshipService.getFriendshipStatus(
        userId,
        friendId
      );
      res.status(200).json(createSuccessResponse(status));
    } catch (error) {
      this.handleError(error, res, "Failed to get friendship status", {
        userId,
        friendId,
      });
    }
  };
  removeFriend = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const { friendId } = req.params;

    try {
      await this.friendshipService.removeFriend(userId, friendId);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res, "Failed to remove friend", {
        userId,
        friendId,
      });
    }
  };
}
