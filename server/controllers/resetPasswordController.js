import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { isPasswordValid } from "../utils/validation.js";
import resetPasswordService from "../services/resetPasswordService.js";

const requestResetPasswordLink = async (req, res) => {
  // Getting body data
  const { email } = req.body;
  // Check if user with entered email address does exist
  const user = await resetPasswordService.getUserByEmailAddress(email);
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
    // TODO: maybe a better email, tell user link is available just 1h and make sure if token is expired, user knows when setting password
  };

  // Send email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Error sending email. Please try again later." });
    } else {
      return res
        .status(200)
        .send({ message: "Password reset link sent successfully!" });
    }
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || !isPasswordValid(newPassword)) {
    return res.status(400).send({
      message:
        "Invalid password. Ensure your password meets the required criteria.",
    });
  }
  try {
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await resetPasswordService.setPassword(decodedUser.id, hashedPassword);
    return res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(400).send({ message: "Invalid or expired URL." });
  }
};

export default { requestResetPasswordLink, resetPassword };
