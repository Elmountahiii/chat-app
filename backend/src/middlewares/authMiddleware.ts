import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwtService";

import jwt from "jsonwebtoken";

type DecodedToken = {
  userId: string;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  req.headers["user-id"] = user._id.toString();
  next();
};
