import type { Request, Response } from "express";
import { FriendshipService } from "../services/friendshipService";
import { UserService } from "../services/userService";
import { createSuccessResponse } from "../types/common";
import { HandleError } from "../utils/errorHandler";
import { FriendshipValidator } from "../validators/friendshipValidator";

export class FriendshipController {
  constructor(
    private friendshipService: FriendshipService,
    private userService: UserService,
    private friendshipValidator: FriendshipValidator
  ) {}

  sendRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const body = req.body;

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const validReceiverId = this.friendshipValidator.validateUUID(
        body.receiverId
      );
      const friendship = await this.friendshipService.sendFriendRequest(
        validUserId,
        validReceiverId
      );
      res.status(201).json(createSuccessResponse(friendship));
    } catch (error) {
      HandleError(error, res, "Failed to send friend request", {
        userId,
        receiverId: body.receiverId,
      });
    }
  };

  acceptRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const body = req.body;
    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const validFriendshipId = this.friendshipValidator.validateUUID(
        body.friendshipId
      );
      const friendship = await this.friendshipService.acceptFriendRequest(
        validFriendshipId,
        validUserId
      );
      res.status(200).json(createSuccessResponse(friendship));
    } catch (error) {
      HandleError(error, res, "Failed to accept friend request", {
        userId,
        friendshipId: body.friendshipId,
      });
    }
  };

  declineRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const body = req.body;

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const validFriendshipId = this.friendshipValidator.validateUUID(
        body.friendshipId
      );
      const friendship = await this.friendshipService.declineFriendRequest(
        validFriendshipId,
        validUserId
      );
      res.status(200).json(createSuccessResponse(friendship));
    } catch (error) {
      HandleError(error, res, "Failed to decline friend request", {
        userId,
        friendshipId: body.friendshipId,
      });
    }
  };

  getPendingRequests = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const requests = await this.friendshipService.getPendingRequests(
        validUserId
      );
      res.status(200).json(createSuccessResponse(requests));
    } catch (error) {
      HandleError(error, res, "Failed to get friend requests", {
        userId,
      });
    }
  };

  searchUsers = async (req: Request, res: Response) => {
    const searchQuery = req.query.query as string;
    const userId = req.headers["user-id"];

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const results = await this.userService.searchUsers(
        searchQuery,
        validUserId
      );
      res.status(200).json(createSuccessResponse(results));
    } catch (error) {
      HandleError(error, res, "Failed to search users", {
        searchQuery,
        userId,
      });
    }
  };

  getAllFriends = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const friends = await this.friendshipService.getAllFriends(validUserId);
      res.status(200).json(createSuccessResponse(friends));
    } catch (error) {
      HandleError(error, res, "Failed to get friends", {
        userId,
      });
    }
  };

  getFriendshipStatus = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const { friendId } = req.params;
    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const validFriendId = this.friendshipValidator.validateUUID(friendId);
      const status = await this.friendshipService.getFriendshipStatus(
        validUserId,
        validFriendId
      );
      res.status(200).json(createSuccessResponse(status));
    } catch (error) {
      HandleError(error, res, "Failed to get friendship status", {
        userId,
        friendId,
      });
    }
  };
  removeFriend = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const { friendId } = req.params;

    try {
      const validUserId = this.friendshipValidator.validateUUID(userId);
      const validFriendId = this.friendshipValidator.validateUUID(friendId);
      await this.friendshipService.removeFriend(validUserId, validFriendId);
      res.status(204).send();
    } catch (error) {
      HandleError(error, res, "Failed to remove friend", {
        userId,
        friendId,
      });
    }
  };
}
