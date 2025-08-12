import express from "express";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";

const userRouter = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.get("/me", userController.getUserProfile);
userRouter.put("/me", userController.updateUserProfile);

export default userRouter;
