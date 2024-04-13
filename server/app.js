import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.js";
import shiftsRouter from "./routes/shiftsRouter.js";
import dotenv from "dotenv";

const PORT = 8080;
const ACCESS_URL =
  "mongodb+srv://anghegabriel:parolaparola@shiftease.w0cvn0c.mongodb.net/ShiftEase?retryWrites=true&w=majority&appName=ShiftEase";
const app = express();

app.use(express.json());
app.use(express.urlencoded());
dotenv.config({ path: "./config/.env" });

app.use("api/shifts", shiftsRouter);
app.use("/api/auth", authRouter);

const connectFn = async () => {
  try {
    await mongoose.connect(ACCESS_URL);
    console.log("You are now connected with MongoDB.");
    app.listen(PORT);
    console.log("Express.js server started.");
  } catch (error) {
    console.log("An error occured while connecting with MongoDB.");
    console.log(error);
  }
};

await connectFn();
