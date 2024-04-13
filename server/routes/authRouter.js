import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";

const authRouter = express.Router();

authRouter.post("/register", registerController.registerUser);
authRouter.post("/login", loginController.login);

export default authRouter;
