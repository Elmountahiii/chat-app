import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type DecodedToken = {
  userId: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decodedToken) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    if (typeof decodedToken === "string") {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { userId } = decodedToken as DecodedToken;
    req.headers["user-id"] = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
