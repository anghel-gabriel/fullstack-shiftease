import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import resetPasswordService from "../services/resetPasswordService.js";
import { logger } from "../app.js";

// This function is used to receive a reset password link
const requestResetPasswordLink = async (req, res) => {
  // Getting body data
  const { email } = req.body;

  if (!email || !isEmailValid(email)) {
    logger.warn("Password reset request without valid email");
    return res
      .status(400)
      .send({ message: "A valid mail address is required." });
  }

  // Check if user with entered email address does exist
  try {
    const user = await resetPasswordService.getUserByEmailAddress(email);
    if (!user) {
      logger.warn(`Password reset request for non-existing email: ${email}`);
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
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The reset link is available for 1 hour.</p>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        logger.error("Error sending password reset email", error);
        return res
          .status(500)
          .send({ message: "Error sending email. Please try again later." });
      } else {
        logger.info(`Password reset link sent to ${email}`);
        return res
          .status(200)
          .send({ message: "Password reset link sent successfully!" });
      }
    });
  } catch (error) {
    logger.error("Error handling password reset request", error);
    return res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
};

// This function is used to set a new password using the reset password link
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || !isPasswordValid(newPassword)) {
    logger.warn("Invalid password format during password reset attempt.");
    return res.status(400).send({
      message:
        "Invalid password. Ensure your password meets the required criteria.",
    });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await resetPasswordService.setPassword(decodedUser.id, hashedPassword);
    logger.info(`Password reset successfully for user ID: ${decodedUser.id}`);
    return res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    logger.error("Error during password reset", error);
    return res
      .status(400)
      .send({ message: "The reset password link has expired or is invalid." });
  }
};

export default { requestResetPasswordLink, resetPassword };
