import jwt from "jsonwebtoken";
import type { Response } from "express";
import { UserService } from "./userServices";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export const sendTokenInCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  res.cookie("token", token, cookieOptions);
};

export const verifyToken = async (token: string) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await UserService.findUserById(decode.userId);
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (e) {
    console.error("JWT verification error:", e);
    return null;
  }
};
