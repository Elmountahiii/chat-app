import express from "express";
import { Provider } from "../utils/provider";

const authRouter = express.Router();
const authController = Provider.getInstance().getAuthController();

authRouter.get("/me", authController.me);
authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.logIn);
authRouter.post("/logout", authController.logout);

export default authRouter;
