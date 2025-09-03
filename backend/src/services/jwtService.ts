import jwt from "jsonwebtoken";
import { AppError } from "../types/common";
import { config } from "../config/environment";

export class JwtService {
  async signToken(userId: string) {
    return jwt.sign(
      {
        userId: userId,
      },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
  }

  async verifyToken(token: string) {
    if (!token) throw new AppError("Unauthorized", 401);
    try {
      const decode = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload & {
        userId: string;
      };
      return decode.userId;
    } catch (e) {
      console.log("JWT verification error:", e);
      throw new AppError("Invalid or expired token", 401);
    }
  }
}
