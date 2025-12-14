import express from "express";
import { Provider } from "../utils/provider";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = express.Router();
const authController = Provider.getInstance().getAuthController();

authRouter.get("/me", authMiddleware, authController.me);
authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.logIn);

export default authRouter;
