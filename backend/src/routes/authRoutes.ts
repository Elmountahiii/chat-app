import express from "express";
import { AuthValidator } from "../validators/authValidator";
import { AuthService } from "../services/authService";
import { AuthRepository } from "../repository/authRepository";
import { AuthController } from "../controllers/authController";

const AuthRouter = express.Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authValidator = new AuthValidator(authService);
const authController = new AuthController(authService, authValidator);

AuthRouter.get("/me", authController.me);
AuthRouter.post("/signup", authController.signUp);
AuthRouter.post("/login", authController.logIn);
AuthRouter.post("/logout", authController.logout);

export default AuthRouter;
