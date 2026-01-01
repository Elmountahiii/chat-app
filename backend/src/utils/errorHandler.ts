import type { Response } from "express";
import { randomUUID } from "crypto";
import { AppError, createErrorResponse } from "../types/common";
import { logger } from "../config/logger";
import { config } from "../config/environment";
import * as z from "zod";

const isProduction = config.NODE_ENV === "production";

export const HandleError = (
	error: unknown,
	res: Response,
	context: string,
	data?: Record<string, unknown>,
) => {
	const errorId = randomUUID();

	if (error instanceof z.ZodError) {
		const errorMessage = isProduction
			? "Validation failed"
			: error.issues
					.map((err) => {
						const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
						return `${path}${err.message}`;
					})
					.join("; ");

		const hasMissingFields = error.issues.some(
			(issue) =>
				issue.code === z.ZodIssueCode.invalid_type &&
				"received" in issue &&
				issue.received === "undefined",
		);
		const statusCode = hasMissingFields ? 422 : 400;

		logger.error(`${context} - ZodError:`, {
			errorId,
			message: errorMessage,
			statusCode,
			issues: isProduction ? undefined : error.issues,
			...data,
		});
		res.status(statusCode).json(createErrorResponse(errorMessage));
	} else if (error instanceof AppError) {
		logger.error(`${context} - AppError:`, {
			errorId,
			message: error.message,
			statusCode: error.statusCode,
			stack: isProduction ? undefined : error.stack,
			...data,
		});
		res
			.status(error.statusCode)
			.json(createErrorResponse(error.message));
	} else if (error instanceof Error) {
		logger.error(`${context} - Error:`, {
			errorId,
			message: error.message,
			stack: isProduction ? undefined : error.stack,
			...data,
		});
		res
			.status(500)
			.json(
				createErrorResponse(isProduction ? "Internal server error" : error.message),
			);
	} else {
		logger.error(`${context} - Unknown error:`, {
			errorId,
			error: String(error),
			...data,
		});
		res.status(500).json(createErrorResponse("Internal server error"));
	}
};
