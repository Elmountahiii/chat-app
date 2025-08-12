import express from "express";
import cors from "cors";

import morgan from "morgan";

import mongoose from "mongoose";
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from "cookie-parser";
import { config, corsConfig } from "./config/environment";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { fileStream, logger } from "./config/logger";

const app = express();

app.use(
  morgan("combined", {
    stream: fileStream,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);

app.use(errorMiddleware);

const serverStart = async () => {
  try {
    logger.info("Connecting to database ....");
    await mongoose.connect(config.MONGODB_URI);
    logger.info("Connected to database successfully");
    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
};

serverStart();
