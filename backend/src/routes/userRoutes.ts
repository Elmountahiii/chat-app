import express from "express";
import { Provider } from "../utils/provider";

const userRouter = express.Router();
const userController = Provider.getInstance().getUserController();

userRouter.get("/me", userController.getUserProfile);
userRouter.put("/me", userController.updateUserProfile);

// search friends
userRouter.get("/search", userController.searchUsers);

export default userRouter;
