import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { UserValidator } from "../validators/userValidator";
import { HandleError } from "../utils/errorHandler";

export class UserController {
	constructor(
		private userService: UserService,
		private userValidator: UserValidator,
	) {}

	getUserProfile = async (req: Request, res: Response) => {
		const userId = req.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

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

	updateUserInformation = async (req: Request, res: Response) => {
		const userId = req.userId;
		const body = req.body;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}
		try {
			const validatedData = this.userValidator.validateUserData(body);
			const updatedUser = await this.userService.updateUserInformation(
				userId,
				validatedData,
			);
			if (!updatedUser) {
				res.status(404).json(createErrorResponse("User not found"));
			} else {
				res.json(
					createSuccessResponse(
						updatedUser,
						"User profile updated successfully",
					),
				);
			}
		} catch (error) {
			HandleError(error, res, "UserController.updateUserProfile", {
				userId,
				body,
			});
		}
	};

	searchUsers = async (req: Request, res: Response) => {
		const searchQuery = req.query.query as string;
		const userId = req.userId;
		if (!userId) {
			res.status(401).json(createErrorResponse("Unauthorized access"));
			return;
		}

		try {
			const validUserId = this.userValidator.validateUUID(userId);

			const results = await this.userService.searchUsers(
				searchQuery,
				validUserId,
			);
			res.status(200).json(createSuccessResponse(results));
		} catch (error) {
			HandleError(error, res, "Failed to search users", {
				searchQuery,
				userId,
			});
		}
	};
}
