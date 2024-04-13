import express from "express";
import registerController from "../controllers/registerController.js";

const authRouter = express.Router();

authRouter.post("/register", registerController.registerUser);
authRouter.post("/login");

export default authRouter;
