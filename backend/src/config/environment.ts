import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.number().min(1).max(65535).default(3001),
  MONGODB_URI: z.string(),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  BACKEND_URL: z.url().default("http://localhost:3001"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export const config = envSchema.parse({
  ENV: process.env.ENV,
  PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});

export const corsConfig = {
  origin: config.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
