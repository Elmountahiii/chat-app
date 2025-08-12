import type { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AuthValidator } from "../validators/authValidator";
import {
  AppError,
  createErrorResponse,
  createSuccessResponse,
} from "../types/common";
import { config } from "../config/environment";
import { logger } from "../config/logger";

export class AuthController {
  constructor(
    private authService: AuthService,
    private authValidator: AuthValidator
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

  signUp = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      await this.authValidator.validateSignUpInput(
        firstName,
        lastName,
        email,
        password
      );
      const user = await this.authService.registerUser(
        firstName,
        lastName,
        email,
        password
      );
      const { password: _, ...userWithoutPassword } = user;

      res
        .status(201)
        .json(
          createSuccessResponse(
            userWithoutPassword,
            "Account created successfully"
          )
        );
    } catch (e) {
      this.handleError(e, res, "Error during sign up", {
        firstName,
        lastName,
        email,
        password,
      });
    }
  };

  logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      await this.authValidator.validateLoginInput(email, password);
      const user = await this.authService.loginUser(email, password);
      const { password: _, ...userWithoutPassword } = user;
      const token = await this.authService.signToken(
        userWithoutPassword._id.toString()
      );
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: config.ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json(createSuccessResponse(userWithoutPassword, "Login successful"));
    } catch (e) {
      this.handleError(e, res, "Error during login", { email, password });
    }
  };

  me = async (req: Request, res: Response) => {
    const token = req.cookies.authToken;
    try {
      const user = await this.authService.verifyToken(token);
      if (!user) {
        res.status(401).json(createErrorResponse("Unauthorized"));
      } else {
        const { password: _, ...userWithoutPassword } = user;
        res
          .status(200)
          .json(
            createSuccessResponse(
              userWithoutPassword,
              "User profile retrieved successfully"
            )
          );
      }
    } catch (e) {
      this.handleError(e, res, "Error retrieving user profile", {
        token,
      });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      res
        .status(200)
        .json(createSuccessResponse(null, "Logged out successfully"));
    } catch (e) {
      this.handleError(e, res, "Error logging out", {
        token: req.cookies.authToken,
      });
    }
  };
}
