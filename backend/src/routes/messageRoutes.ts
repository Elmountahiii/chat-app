import express from "express";
import { Provider } from "../utils/provider";

const messageRouter = express.Router();
const messageController = Provider.getInstance().getMessageController();

messageRouter.get("/history/:friendId", messageController.getMessageHistory);
messageRouter.post("/send", messageController.sendMessage);

export default messageRouter;
