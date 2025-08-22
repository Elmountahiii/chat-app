import type { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../types/common";
import { Provider } from "../utils/provider";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtService = Provider.getInstance().getJwtService();

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
    console.error("JWT verification error:", error);
    res.status(401).json(createErrorResponse("Unauthorized access"));
  }
};
