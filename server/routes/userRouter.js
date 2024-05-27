import express from "express";
import profileRouter from "./userRoutes/profileRouter.js";
import shiftsRouter from "./userRoutes/shiftsRouter.js";
import uploadRouter from "./userRoutes/uploadRouter.js";

const userRouter = express.Router();

// Profile router of users
userRouter.use("/profile", profileRouter);

// Shifts router of users
userRouter.use("/shifts", shiftsRouter);

// Upload router of users
userRouter.use("/upload", uploadRouter);

export default userRouter;
