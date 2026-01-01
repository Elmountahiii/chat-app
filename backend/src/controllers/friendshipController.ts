import { FriendshipService } from "../services/friendsipService";
import type { Request, Response } from "express";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { HandleError } from "../utils/errorHandler";

export class FriendshipController {
	constructor(private friendshipService: FriendshipService) {}

	getFriendsList = async (req: Request, res: Response) => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const friendsList = await this.friendshipService.getFriendsList(userId);
			res
				.status(200)
				.json(
					createSuccessResponse(
						friendsList,
						"Friends list retrieved successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.getFriendsList", {
				userId,
			});
		}
	};

	getFriendshipStatus = async (req: Request, res: Response) => {
		const userOneId = req.userId;
		const userTwoId = req.params.userId;
		if (!userOneId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const friendshipStatus = await this.friendshipService.getFriendshipStatus(
				userOneId,
				userTwoId,
			);
			res
				.status(200)
				.json(
					createSuccessResponse(
						friendshipStatus,
						"Friendship status retrieved successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.getFriendshipStatus", {
				userOneId,
				userTwoId,
			});
		}
	};

	getPendingFriendRequests = async (req: Request, res: Response) => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const pendingRequests =
				await this.friendshipService.getPendingFriendRequests(userId);
			res
				.status(200)
				.json(
					createSuccessResponse(
						pendingRequests,
						"Pending friend requests retrieved successfully",
					),
				);
		} catch (error) {
			HandleError(
				error,
				res,
				"FriendshipController.getPendingFriendRequests",
				{
					userId,
				},
			);
		}
	};

	getSentFriendRequests = async (req: Request, res: Response) => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const sentRequests =
				await this.friendshipService.getSentFriendRequests(userId);
			res
				.status(200)
				.json(
					createSuccessResponse(
						sentRequests,
						"Sent friend requests retrieved successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.getSentFriendRequests", {
				userId,
			});
		}
	};

	sendFriendshipRequest = async (req: Request, res: Response) => {
		const senderId = req.userId;
		const reciverId = req.params.userId;
		if (!senderId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const friendship = await this.friendshipService.sendFriendshipRequest(
				senderId,
				reciverId,
			);
			res
				.status(200)
				.json(
					createSuccessResponse(
						friendship,
						"Friendship request sent successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.sendFriendshipRequest", {
				senderId,
				reciverId,
			});
		}
	};

	accepetFriendshipRequest = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendshipId = req.params.friendshipId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const friendship = await this.friendshipService.accepetFriendshipRequest(
				userId,
				friendshipId,
			);
			res
				.status(200)
				.json(
					createSuccessResponse(
						friendship,
						"Friendship request accepted successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.accepetFriendshipRequest", {
				userId,
				friendshipId,
			});
		}
	};

	declineFriendshipRequest = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendshipId = req.params.friendshipId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const result = await this.friendshipService.declineFriendshipRequest(
				userId,
				friendshipId,
			);
			res
				.status(200)
				.json(
					createSuccessResponse(
						result,
						"Friendship request declined successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.declineFriendshipRequest", {
				userId,
				friendshipId,
			});
		}
	};

	cancelFriendShipRequest = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendshipId = req.params.friendshipId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const result = await this.friendshipService.cancelFriendShipRequest(
				userId,
				friendshipId,
			);
			res
				.status(200)
				.json(
					createSuccessResponse(
						result,
						"Friendship request canceled successfully",
					),
				);
		} catch (error) {
			HandleError(error, res, "FriendshipController.cancelFriendShipRequest", {
				userId,
				friendshipId,
			});
		}
	};

	removeFriend = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendId = req.params.friendId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
		

			const result = await this.friendshipService.removeFriend(
				userId,
				friendId,
			);
			res
				.status(200)
				.json(createSuccessResponse(result, "Friend removed successfully"));
		} catch (error) {
			HandleError(error, res, "FriendshipController.removeFriend", {
				userId,
				friendId,
			});
		}
	};

	blockUser = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendId = req.params.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const result = await this.friendshipService.blockUser(userId, friendId);
			res
				.status(200)
				.json(createSuccessResponse(result, "User blocked successfully"));
		} catch (error) {
			HandleError(error, res, "FriendshipController.blockUser", {
				userId,
				friendId,
			});
		}
	};

	unblockUser = async (req: Request, res: Response) => {
		const userId = req.userId;
		const friendId = req.params.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const result = await this.friendshipService.unblockUser(userId, friendId);
			res
				.status(200)
				.json(createSuccessResponse(result, "User unblocked successfully"));
		} catch (error) {
			HandleError(error, res, "FriendshipController.unblockUser", {
				userId,
				friendId,
			});
		}
	};
}
