import type { Request, Response } from "express";
import { UserService } from "../services/userServices";
import {
  generateToken,
  sendTokenInCookie,
  verifyToken,
} from "../services/jwtService";
import bcrypt from "bcrypt";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserService.createUser(username, email, hashedPassword);
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
      });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    const token = generateToken(user._id.toString());
    sendTokenInCookie(res, token);
    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verify = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }
  const user = await verifyToken(token);
  if (!user) {
    res.status(401).json({
      status: "Unauthorized",
    });
    return;
  }
  res.status(200).json({
    status: "Authorized",
    user,
  });
};
