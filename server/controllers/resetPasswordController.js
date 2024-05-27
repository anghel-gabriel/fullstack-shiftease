import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { isPasswordValid } from "../utils/validation.js";
import resetPasswordService from "../services/resetPasswordService.js";

// This function is used to receive a reset password link
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
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The reset link is available 1h.</p>`,
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

// This function in used to set a new password using the reset password link
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
    return res
      .status(400)
      .send({ message: "The reset password link expired." });
  }
};

export default { requestResetPasswordLink, resetPassword };
