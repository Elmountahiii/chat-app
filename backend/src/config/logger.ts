import winston from "winston";
import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logsDir, "server.log"),
    }),
  ],
});

export const fileStream = fs.createWriteStream(
  path.join(logsDir, "server.log"),
  {
    flags: "a",
  }
);
