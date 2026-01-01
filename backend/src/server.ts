import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import { config, corsConfig } from "./config/environment";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import friendshipRoutes from "./routes/friendshipRoute";
import conversationRoutes from "./routes/conversationRoute";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { fileStream, logger } from "./config/logger";
import http from "http";
import { Provider } from "./utils/provider";
import messageRoutes from "./routes/messageRoutes";
import { createErrorResponse } from "./types/common";

const app = express();
const server = http.createServer(app);

app.use(
	morgan("combined", {
		stream: fileStream,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.get("/api/health", (req, res) => {
	res.status(200).json({ message: "Server is healthy" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
	res.status(200).json({ message: "Protected route accessed" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);
app.use("/api/friendship", authMiddleware, friendshipRoutes);
app.use("/api/conversations", authMiddleware, conversationRoutes);

app.use((req, res) => {
	logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);

	res.status(404).json(createErrorResponse("Route not found"));
});

app.use(errorMiddleware);

const serverStart = async () => {
	try {
		logger.info("Connecting to database ....");
		await mongoose.connect(config.MONGODB_URI);
		logger.info("Connected to database successfully");
		Provider.getInstance().getSocketService(server);
		server.listen(config.PORT, () => {
			logger.info(`Server is running on http://0.0.0.0:${config.PORT}`);
		});
	} catch (error) {
		logger.error("Error starting the server:", error);
		process.exit(1);
	}
};

const shutdown = () => {
	logger.info("Shutting down server...");
	server.close(async () => {
		await mongoose.disconnect();
		logger.info("Server shut down complete.");
		process.exit(0);
	});
};

// process.on("SIGTERM", () => shutdown());
// process.on("SIGINT", () => shutdown());

serverStart();
