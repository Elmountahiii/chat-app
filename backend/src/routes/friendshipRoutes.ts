import express from "express";

import { Provider } from "../utils/provider";

const friendshipRouter = express.Router();

const friendshipController = Provider.getInstance().getFriendshipController();

// get all friends
friendshipRouter.get("/all-friends", friendshipController.getAllFriends);
friendshipRouter.get(
  "/pending-requests",
  friendshipController.getPendingRequests
);
friendshipRouter.get(
  "/friendship-status",
  friendshipController.getFriendshipStatus
);
friendshipRouter.post("/send-request", friendshipController.sendRequest);
friendshipRouter.post("/accept-request", friendshipController.acceptRequest);
friendshipRouter.post("/decline-request", friendshipController.declineRequest);
friendshipRouter.post("/remove-friend", friendshipController.removeFriend);

// search friends
friendshipRouter.get("/search", friendshipController.searchUsers);

export default friendshipRouter;
