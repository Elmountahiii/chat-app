import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { UserValidator } from "../validators/userValidator";
import { HandleError } from "../utils/errorHandler";
import { TypedEventEmitter } from "../validators/events";

export class UserController {
  constructor(
    private userService: UserService,
    private userValidator: UserValidator,
    private messageEventEmitter: TypedEventEmitter
  ) {}

  getUserProfile = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;

    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        res.status(404).json(createErrorResponse("User not found"));
      } else {
        res.json(user);
      }
    } catch (error) {
      HandleError(error, res, "UserController.getUserProfile", { userId });
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const body = req.body;

    try {
      const validatedData = this.userValidator.validateUserData(body);
      console.log("Validated Data:", validatedData);
      const updatedUser = await this.userService.updateUser(
        userId,
        validatedData
      );
      if (!updatedUser) {
        res.status(404).json(createErrorResponse("User not found"));
      } else {
        res.json(
          createSuccessResponse(
            updatedUser,
            "User profile updated successfully"
          )
        );
      }
    } catch (error) {
      HandleError(error, res, "UserController.updateUserProfile", {
        userId,
        body,
      });
    }
  };

  sendRequest = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"];
    const body = req.body;

    try {
      const validUserId = this.userValidator.validateUUID(userId);
      const validReceiverId = this.userValidator.validateUUID(body.receiverId);
      const friendship = await this.userService.sendFriendRequest(
        validUserId,
        validReceiverId
      );
      this.messageEventEmitter.emit("broadcast:requestSent", {
        userId: validUserId,
        receiverId: validReceiverId,
        friendShipRequest: friendship,
      });
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
      const validUserId = this.userValidator.validateUUID(userId);
      const validFriendshipId = this.userValidator.validateUUID(
        body.friendshipId
      );
      const friendship = await this.userService.acceptFriendRequest(
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
      const validUserId = this.userValidator.validateUUID(userId);
      const validFriendshipId = this.userValidator.validateUUID(
        body.friendshipId
      );
      const friendship = await this.userService.declineFriendRequest(
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
      const validUserId = this.userValidator.validateUUID(userId);
      const requests = await this.userService.getPendingRequests(validUserId);
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
      const validUserId = this.userValidator.validateUUID(userId);

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
      const validUserId = this.userValidator.validateUUID(userId);
      const friends = await this.userService.getAllFriends(validUserId);
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
      const validUserId = this.userValidator.validateUUID(userId);
      const validFriendId = this.userValidator.validateUUID(friendId);
      const status = await this.userService.getFriendshipStatus(
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
      const validUserId = this.userValidator.validateUUID(userId);
      const validFriendId = this.userValidator.validateUUID(friendId);
      await this.userService.removeFriend(validUserId, validFriendId);
      res.status(204).send();
    } catch (error) {
      HandleError(error, res, "Failed to remove friend", {
        userId,
        friendId,
      });
    }
  };
}
