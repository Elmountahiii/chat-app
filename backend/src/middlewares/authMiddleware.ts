import type { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwtService";
import { createErrorResponse } from "../types/common";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtService = new JwtService();
  const token = req.cookies.authToken;
  if (!token) {
    res.status(401).json(createErrorResponse("Unauthorized access"));
    return;
  }
  try {
    const userId = await jwtService.verifyToken(token);
    req.headers["user-id"] = userId;
    next();
  } catch (error) {
    res.status(401).json(createErrorResponse("Unauthorized access"));
  }
};
