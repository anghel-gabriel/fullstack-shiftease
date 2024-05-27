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

const PORT = process.env.PORT ?? 8080;
const app = express();

// Ensure the "pictures" folder exists
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
if (!fs.existsSync(path.join(__dirname, "../../pictures"))) {
  fs.mkdirSync(path.join(__dirname, "../../pictures"));
}

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
    console.log("You are now connected with MongoDB.");
    app.listen(PORT, () => {
      console.log(`Express.js server started on port ${PORT}.`);
    });
  } catch (error) {
    console.log("An error occurred while connecting with MongoDB.");
    console.log(error);
  }
};

await connectFn();
