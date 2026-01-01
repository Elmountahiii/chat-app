import type { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../types/common";
import { JwtService } from "../services/jwtService";
import { HandleError } from "../utils/errorHandler";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.authToken;

	if (!token) {
		res
			.status(401)
			.json(createErrorResponse("Unauthorized access - No token provided"));
		return;
	}

	try {
		const userId = await JwtService.verifyToken(token);
		req.userId = userId;
		next();
	} catch (error) {
		HandleError(error, res, "authMiddleware.verifyToken", {
			hasToken: !!token,
		});
	}
};
