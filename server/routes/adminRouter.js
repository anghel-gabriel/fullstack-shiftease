import express from "express";
import shiftsRouter from "./adminRoutes/shiftsRouter.js";
import profileRouter from "./adminRoutes/profileRouter.js";
import uploadRouter from "./adminRoutes/uploadRouter.js";

const adminRouter = express.Router();

// Profile router of admins
adminRouter.use("/profile", profileRouter);

// Shifts router of admins
adminRouter.use("/shifts", shiftsRouter);

// Upload router of admins
adminRouter.use("/upload", uploadRouter);

export default adminRouter;
