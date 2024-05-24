import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import resetPasswordController from "../controllers/resetPasswordController.js";
import sessionController from "../controllers/sessionController.js";

const authRouter = express.Router();

// Register
authRouter.post("/register", registerController.registerUser);

// Login
authRouter.post("/login", loginController.login);

// This endpoint is used to send a reset password link to the user
authRouter.post(
  "/request-reset-password",
  resetPasswordController.requestResetPasswordLink
);

// Reset password
authRouter.post(
  "/reset-password/:token",
  resetPasswordController.resetPassword
);

/* 
This endpoint is used for the first step of the register form. 
It checks if username or email address is already existing, 
if password respects the requested format and if the passwords. 
*/
authRouter.post("/credentials", registerController.checkCredentials);

/* 
This endpoint is used to check cookies when accessing the website
or refreshing the page
*/
authRouter.get("/validate-session", sessionController.validateSession);

// This is used to delete cookies when manually logging out
authRouter.get("/log-out", sessionController.logOut);

export default authRouter;
