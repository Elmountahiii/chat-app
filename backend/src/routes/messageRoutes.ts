import express from "express";
import { Provider } from "../utils/provider";

const messageRouter = express.Router();
const messageController = Provider.getInstance().getMessageController();

messageRouter.get("/conversations", messageController.getConversations);
messageRouter.post("/conversations", messageController.createConversation);
messageRouter.get(
  "/conversations/:id/messages",
  messageController.getConversationMessages
);
messageRouter.post(
  "/conversations/:id/messages",
  messageController.sendMessage
);
messageRouter.patch(
  "/conversations/:id/read",
  messageController.markConversationMessagesAsRead
);

export default messageRouter;
