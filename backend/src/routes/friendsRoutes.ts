import express from "express";
import { FriendshipController } from "../controllers/friendsController";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { FriendshipService } from "../services/friendshipService";
import { FriendshipRepository } from "../repository/friendshipRepository";

const friendsRouter = express.Router();

const userRepo = new UserRepository();
const friendshipRepo = new FriendshipRepository(userRepo);
const userService = new UserService(userRepo);
const friendshipService = new FriendshipService(friendshipRepo);
const friendshipController = new FriendshipController(
  friendshipService,
  userService
);

// get all friends
friendsRouter.get("/all-friends", friendshipController.getAllFriends);
friendsRouter.get("/pending-requests", friendshipController.getPendingRequests);
friendsRouter.get(
  "/friendship-status",
  friendshipController.getFriendshipStatus
);
friendsRouter.post("/send-request", friendshipController.sendRequest);
friendsRouter.post("/accept-request", friendshipController.acceptRequest);
friendsRouter.post("/decline-request", friendshipController.declineRequest);
friendsRouter.post("/remove-friend", friendshipController.removeFriend);

// search friends
friendsRouter.get("/search", friendshipController.searchUsers);

export default friendsRouter;
