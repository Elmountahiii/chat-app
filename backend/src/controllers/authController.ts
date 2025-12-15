import type { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AuthValidator } from "../validators/authValidator";
import { createErrorResponse, createSuccessResponse } from "../types/common";
import { JwtService } from "../services/jwtService";
import { HandleError } from "../utils/errorHandler";

export class AuthController {
	constructor(
		private authService: AuthService,
		private authValidator: AuthValidator,
	) {}

	signUp = async (req: Request, res: Response) => {
		const body = req.body;
		try {
			const validateData = await this.authValidator.validateSignUpInput(body);
			await this.authService.registerUser(
				validateData.firstName,
				validateData.lastName,
				validateData.email,
				validateData.password,
			);

			res
				.status(201)
				.json(createSuccessResponse(null, "Account created successfully"));
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
				validData.password,
			);
			const token = await JwtService.signToken(user._id.toString());
			res.cookie("authToken", token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			res.status(200).json(createSuccessResponse(user, "Login successful"));
		} catch (e) {
			HandleError(e, res, "Error during login", body);
		}
	};

	me = async (req: Request, res: Response) => {
		const token = req.cookies.authToken;

		if (!token) {
			res.status(401).json(createErrorResponse("No token provided"));
			return;
		}

		try {
			const userId = await JwtService.verifyToken(token);
			if (!userId) {
				res.status(401).json(createErrorResponse("Unauthorized"));
			} else {
				const user = await this.authService.findUserById(userId);
				if (!user) {
					res.status(404).json(createErrorResponse("User not found"));
					return;
				}

				res
					.status(200)
					.json(
						createSuccessResponse(user, "User profile retrieved successfully"),
					);
			}
		} catch (e) {
			HandleError(e, res, "Error retrieving user profile", {
				token,
			});
		}
	};
}
