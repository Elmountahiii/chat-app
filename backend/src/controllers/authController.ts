import type { Request, Response } from "express";
import { UserService } from "../services/userServices";
import { generateToken, sendTokenInCookie } from "../services/jwtService";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      console.log("email", email, "password", password, "username", userName);
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const user = await UserService.createUser(userName, email, hashedPassword);
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
    const isPasswordValid = await Bun.password.verify(password, user.password);
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
