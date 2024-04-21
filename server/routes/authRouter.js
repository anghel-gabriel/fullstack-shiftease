import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";

const authRouter = express.Router();

authRouter.post("/register", registerController.registerUser);
authRouter.post("/login", loginController.login);

// this is used to check if username and email address are already existing
authRouter.post("/credentials", registerController.checkCredentials);

export default authRouter;
