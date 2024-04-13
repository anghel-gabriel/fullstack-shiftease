import express from "express";
import { postAddShift } from "../controllers/shiftsController.js";

const userRouter = express.Router();

userRouter.post("/add-shift", postAddShift);

export default userRouter;
