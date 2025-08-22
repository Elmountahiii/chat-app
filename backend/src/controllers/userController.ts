import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { UserValidator } from "../validators/userValidator";
import { HandleError } from "../utils/errorHandler";

export class UserController {
  constructor(
    private userService: UserService,
    private userValidator: UserValidator
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
}
