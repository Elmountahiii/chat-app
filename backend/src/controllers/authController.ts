import type { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AuthValidator } from "../validators/authValidator";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { config } from "../config/environment";
import { JwtService } from "../services/jwtService";
import { HandleError } from "../utils/errorHandler";

export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private authValidator: AuthValidator
  ) {}

  signUp = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const validateData = await this.authValidator.validateSignUpInput(body);
      const user = await this.authService.registerUser(
        validateData.firstName,
        validateData.lastName,
        validateData.email,
        validateData.password
      );

      res
        .status(201)
        .json(createSuccessResponse(user, "Account created successfully"));
    } catch (e) {
      HandleError(e, res, "Error during sign up", {
        body,
      });
    }
  };

  logIn = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const validData = await this.authValidator.validateLoginInput(body);
      const user = await this.authService.loginUser(
        validData.email,
        validData.password
      );
      const token = await this.jwtService.signToken(user._id.toString());
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: config.ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
      res.status(200).json(createSuccessResponse(user, "Login successful"));
    } catch (e) {
      HandleError(e, res, "Error during login", body);
    }
  };

  me = async (req: Request, res: Response) => {
    const token = req.cookies.authToken;
    try {
      const userId = await this.jwtService.verifyToken(token);
      if (!userId) {
        res.status(401).json(createErrorResponse("Unauthorized"));
      } else {
        const user = await this.authService.getUserById(userId);
        if (!user) {
          res.status(404).json(createErrorResponse("User not found"));
          return;
        }
        res
          .status(200)
          .json(
            createSuccessResponse(user, "User profile retrieved successfully")
          );
      }
    } catch (e) {
      HandleError(e, res, "Error retrieving user profile", {
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
      HandleError(e, res, "Error logging out", {
        token: req.cookies.authToken,
      });
    }
  };
}
