import express from "express";
import { Provider } from "../utils/provider";

const messageRouter = express.Router();
const messageController = Provider.getInstance().getMessageController();

messageRouter.get(
	"/conversations/:conversationId/messages",
	messageController.getConversationMessages,
);

messageRouter.patch(
	"/conversations/:conversationId/read",
	messageController.markConversationMessagesAsRead,
);

export default messageRouter;
