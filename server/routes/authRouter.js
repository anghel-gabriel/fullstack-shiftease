import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/register", registerController.registerUser);

authRouter.post("/login", loginController.login);

// This endpoint is used to send a reset password link to the user
authRouter.post("/request-reset-password", async (req, res) => {
  // Getting body data
  const { email } = req.body;
  // Check if user with entered email address does exist
  const user = await User.findOne({ emailAddress: email });
  if (!user) {
    return res
      .status(404)
      .send({ message: "User with entered email address not found." });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  const resetLink = `http://localhost:4200/reset-password/${token}`;

  // Email transporter setup
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: process.env.EMAIL_API_KEY,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
      return res.status(200).send("Password reset link sent successfully!");
    }
  });
});

// Reset password
authRouter.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: decoded.id }, { password: hashedPassword });
    res.status(200).send("Password reset successful");
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
});

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
