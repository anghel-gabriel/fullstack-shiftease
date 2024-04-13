import express from "express";
import { postAddShift } from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

shiftsRouter.post("/add-shift", postAddShift);

export default shiftsRouter;
