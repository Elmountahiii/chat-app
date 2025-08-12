import type { Request, Response } from "express";
import { UserService } from "../services/userService";
import {
  AppError,
  createErrorResponse,
  createSuccessResponse,
} from "../types/common";
import { logger } from "../config/logger";

export class UserController {
  constructor(private userService: UserService) {}

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
      res.status(500).json(createErrorResponse(error.message));
    } else {
      logger.error(`${context} - Unknown error:`, {
        error: String(error),
        ...data,
      });
      res.status(500).json(createErrorResponse("Internal server error"));
    }
  }

  getUserProfile = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    console.log("Fetching user profile for userId:", userId);

    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        res.status(404).json(createErrorResponse("User not found"));
      } else {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      }
    } catch (error) {
      this.handleError(error, res, "UserController.getUserProfile", { userId });
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.headers["user-id"] as string;
    const updateData = req.body;

    try {
      const updatedUser = await this.userService.updateUser(userId, updateData);
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
      this.handleError(error, res, "UserController.updateUserProfile", {
        userId,
        updateData,
      });
    }
  };
}
