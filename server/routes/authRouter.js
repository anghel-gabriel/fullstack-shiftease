import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import resetPasswordController from "../controllers/resetPasswordController.js";

const authRouter = express.Router();

authRouter.post("/register", registerController.registerUser);

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
This is used to check cookies when accessing the website
or refreshing the page
*/
authRouter.get("/validate-session", async (req, res) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token)
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = deserializedToken.id;
    const userData = await User.findOne({ _id: userId });
    res.status(200).send(userData);
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).send({ message: "Invalid token." });
    else return res.status(403).send({ message: "Unauthorized access!" });
  }
});

// This is used to delete cookies when manually logging out
authRouter.get("/log-out", async (req, res) => {
  res.clearCookie("LOGIN_INFO");
  res.status(200).send();
});

export default authRouter;
