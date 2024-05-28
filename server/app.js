import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRouter.js";
import dotenv from "dotenv";
import authorizeMdw from "./middlewares/authorize.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import winston from "winston";
import { formatTimestamp } from "./utils/computation.js";

const PORT = process.env.PORT ?? 8080;
const app = express();

// Ensure the "pictures" folder exists
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
if (!fs.existsSync(path.join(__dirname, "../../pictures"))) {
  fs.mkdirSync(path.join(__dirname, "../../pictures"));
}

// Logger configuration
const { combine, printf, colorize } = winston.format;
const logFormat = printf(({ level, message }) => {
  const timestamp = formatTimestamp();
  return `${timestamp} [${level}]: ${message}`;
});
export const logger = winston.createLogger({
  level: "info",
  format: combine(logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path configuration for environment variables
dotenv.config({ path: "./config/.env" });

// Routes
app.use("/api/auth", authRouter);
app.use("/pictures", express.static(path.join(__dirname, "pictures")));
app.use("/api/user", authorizeMdw.checkUserIsAuthenticated, userRouter);
app.use("/api/admin", authorizeMdw.checkUserIsAdmin, adminRouter);

// Connect to MongoDB, start server
const connectFn = async () => {
  try {
    await mongoose.connect(process.env.ACCESS_URL);
    logger.info("You are now connected with MongoDB.");
    app.listen(PORT, () => {
      logger.info(`Express.js server started on port ${PORT}.`);
    });
  } catch (error) {
    logger.error("An error occurred while connecting with MongoDB.");
    logger.error(error.message);
  }
};

await connectFn();
