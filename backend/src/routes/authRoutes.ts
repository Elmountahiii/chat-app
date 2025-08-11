import express from "express";
import { AuthValidator } from "../validators/authValidator";
import { AuthService } from "../services/authService";
import { AuthRepository } from "../repository/authRepository";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authValidator = new AuthValidator(authService);
const authController = new AuthController(authService, authValidator);

router.get("/me", authController.me);
router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);
router.post("/logout", authController.logout);

export default router;
