import express from "express";
import { Provider } from "../utils/provider";

const friendshipRouter = express.Router();
const friendshipController = Provider.getInstance().getFriendshipController();

friendshipRouter.get("/friends", friendshipController.getFriendsList);

friendshipRouter.get(
	"/status/:userId",
	friendshipController.getFriendshipStatus,
);

friendshipRouter.get("/pending", friendshipController.getPendingFriendRequests);

friendshipRouter.get("/sent", friendshipController.getSentFriendRequests);

friendshipRouter.post(
	"/request/:userId",
	friendshipController.sendFriendshipRequest,
);

friendshipRouter.post(
	"/accept/:friendshipId",
	friendshipController.accepetFriendshipRequest,
);

friendshipRouter.post(
	"/decline/:friendshipId",
	friendshipController.declineFriendshipRequest,
);

friendshipRouter.delete(
	"/cancel/:friendshipId",
	friendshipController.cancelFriendShipRequest,
);

friendshipRouter.delete("/remove/:friendId", friendshipController.removeFriend);

friendshipRouter.post("/block/:userId", friendshipController.blockUser);

friendshipRouter.post("/unblock/:userId", friendshipController.unblockUser);

export default friendshipRouter;
