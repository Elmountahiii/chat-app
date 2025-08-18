import express from "express";
import { AuthValidator } from "../validators/authValidator";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";
import { UserRepository } from "../repository/userRepository";
import { JwtService } from "../services/jwtService";

const AuthRouter = express.Router();
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authValidator = new AuthValidator(authService);
const jwtService = new JwtService();
const authController = new AuthController(
  authService,
  jwtService,
  authValidator
);

AuthRouter.get("/me", authController.me);
AuthRouter.post("/signup", authController.signUp);
AuthRouter.post("/login", authController.logIn);
AuthRouter.post("/logout", authController.logout);

export default AuthRouter;
