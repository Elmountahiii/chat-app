import type { Request, Response, NextFunction } from "express";
import { AppError, createErrorResponse, HttpStatus } from "../types/common";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
    
  const statusCode =
    err instanceof AppError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json(createErrorResponse(err.message));
};
