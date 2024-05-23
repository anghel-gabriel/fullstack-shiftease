import express from "express";
import profileRouter from "./userRoutes/profileRouter.js";
import shiftsRouter from "./userRoutes/shiftsRouter.js";
import uploadRouter from "./userRoutes/uploadRouter.js";

const userRouter = express.Router();

userRouter.use("/profile", profileRouter);
userRouter.use("/shifts", shiftsRouter);
userRouter.use("/upload", uploadRouter);

export default userRouter;
