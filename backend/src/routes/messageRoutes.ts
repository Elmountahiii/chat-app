import express from "express";
import { Provider } from "../utils/provider";

const messageRouter = express.Router();
const messageController = Provider.getInstance().getMessageController();

messageRouter.get(
	"/conversations/:id/messages",
	messageController.getConversationMessages,
);

messageRouter.patch(
	"/conversations/:id/read",
	messageController.markConversationMessagesAsRead,
);

export default messageRouter;
