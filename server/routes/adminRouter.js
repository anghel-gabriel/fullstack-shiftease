import express from "express";
import shiftsRouter from "./adminRoutes/shiftsRouter.js";
import profileRouter from "./adminRoutes/profileRouter.js";
import uploadRouter from "./adminRoutes/uploadRouter.js";

const adminRouter = express.Router();

adminRouter.use("/profile", profileRouter);
adminRouter.use("/shifts", shiftsRouter);
adminRouter.use("/upload", uploadRouter);

export default adminRouter;
