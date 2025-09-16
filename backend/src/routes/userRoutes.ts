import express from "express";
import { Provider } from "../utils/provider";

const userRouter = express.Router();
const userController = Provider.getInstance().getUserController();

userRouter.get("/me", userController.getUserProfile);
userRouter.put("/me", userController.updateUserProfile);

userRouter.get("/all-friends", userController.getAllFriends);
userRouter.get("/pending-requests", userController.getPendingRequests);
userRouter.get("/friendship-status", userController.getFriendshipStatus);
userRouter.post("/send-request", userController.sendRequest);
userRouter.post("/accept-request", userController.acceptRequest);
userRouter.post("/decline-request", userController.declineRequest);
userRouter.post("/remove-friend", userController.removeFriend);

// search friends
userRouter.get("/search", userController.searchUsers);

export default userRouter;
