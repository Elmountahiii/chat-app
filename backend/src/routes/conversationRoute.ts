import express from "express";
import { Provider } from "../utils/provider";

const conversationRouter = express.Router();
const conversationController =
	Provider.getInstance().getConversationController();

// create a converstaion
conversationRouter.post(
	"/:otherUserId",
	conversationController.createConversation,
);

// Get all conversations for the authenticated user
conversationRouter.get("/", conversationController.getConversations);

// Get a specific conversation by ID
conversationRouter.get(
	"/:conversationId",
	conversationController.getConversationById,
);

// Get conversation between authenticated user and another user
conversationRouter.get(
	"/with/:otherUserId",
	conversationController.getUserConversationWithAnotherUser,
);

// Delete a conversation
conversationRouter.delete(
	"/:conversationId",
	conversationController.deleteConversation,
);

export default conversationRouter;
