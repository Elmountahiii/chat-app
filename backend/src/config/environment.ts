import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.number().min(1).max(65535).default(3001),
	MONGODB_URI: z.string(),
	NEXT_PUBLIC_FRONTEND_URL: z.url().default("http://localhost:3000"),
	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export const config = envSchema.parse({
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
	MONGODB_URI: process.env.MONGODB_URI,
	NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
	JWT_SECRET: process.env.JWT_SECRET,
});

const allowedOrigins = [
	config.NEXT_PUBLIC_FRONTEND_URL,
	"http://localhost:3000",
	"http://192.168.1.3:3000",
];

export const corsConfig = {
	origin: allowedOrigins,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	credentials: true,
};
