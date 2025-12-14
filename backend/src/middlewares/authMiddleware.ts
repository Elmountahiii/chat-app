import type { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../types/common";
import { JwtService } from "../services/jwtService";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res
			.status(401)
			.json(
				createErrorResponse(
					"Unauthorized access - Missing or invalid Authorization header",
				),
			);
		return;
	}

	const token = authHeader.substring(7);

	try {
		const userId = await JwtService.verifyToken(token);
		req.userId = userId;
		next();
	} catch (error) {
		console.error("JWT verification error:", error);
		res
			.status(401)
			.json(createErrorResponse("Unauthorized access - Invalid token"));
	}
};
