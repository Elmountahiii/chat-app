import type { Response } from "express";

import { AppError, createErrorResponse } from "../types/common";
import { logger } from "../config/logger";
import * as z from "zod";

export const HandleError = async (
  error: unknown,
  res: Response,
  context: string,
  data?: Record<string, unknown>
) => {
  if (error instanceof z.ZodError) {
    const errorMessage = error.issues
      .map((err) => {
        const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
        return `${path}${err.message}`;
      })
      .join("; ");

    logger.error(`${context} - ZodError:`, {
      message: errorMessage,
      issues: error.issues,
      statusCode: 400,
      ...data,
    });
    res.status(400).json(createErrorResponse(errorMessage));
  } else if (error instanceof AppError) {
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
};
