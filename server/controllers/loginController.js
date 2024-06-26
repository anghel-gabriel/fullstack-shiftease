import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginService from "../services/loginService.js";
import { logger } from "../app.js";

const login = async (req, res) => {
  // Getting request data
  const { usernameOrEmail, password, loginMethod } = req.body;
  if (!usernameOrEmail || !password || !loginMethod) {
    logger.warn("Login attempt with missing mandatory fields.");
    return res
      .status(400)
      .send({ message: "Please fill all the mandatory fields." });
  }
  try {
    // Looking for the user in database
    let foundUser;
    if (loginMethod === "email") {
      foundUser = await loginService.getUserByEmailAddress(usernameOrEmail);
    } else if (loginMethod === "username") {
      foundUser = await loginService.getUserByUsername(usernameOrEmail);
    } else {
      logger.warn("Login attempt with invalid login method.");
      return res
        .status(400)
        .send({ message: "Please select a valid login method." });
    }

    // Notice user that his username/email address is wrong
    if (!foundUser) {
      logger.warn(
        `Login attempt with non-existing ${loginMethod}: ${usernameOrEmail}`
      );
      return res.status(400).send({
        message: `Account with entered ${loginMethod} doesn't exist.`,
      });
    }

    const userPassword = foundUser.password;
    // Checking if entered password is equal to 'decrypted' hash password from database
    bcrypt.compare(password, userPassword, (err, result) => {
      if (err) {
        logger.error("Error during password comparison", err);
        return res.status(500).send({
          message:
            "An error occurred while logging in. Please try again later.",
        });
      }
      if (result) {
        const user = foundUser;
        const data = {
          id: user._id,
          userRole: user.userRole,
        };
        const token = jwt.sign(data, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        // Setting the cookie
        res.cookie("LOGIN_INFO", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 604800000, // The equivalent of 7 days
        });
        logger.info(`User ${user.username} authenticated successfully.`);
        // Returning user's data
        return res.status(200).send({
          message: "You have been authenticated.",
          user: {
            emailAddress: user.emailAddress,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            gender: user.gender,
            userRole: user.userRole,
            photoURL: user.photoURL,
          },
        });
      } else {
        logger.warn(
          `Failed login attempt for user ${usernameOrEmail}: Incorrect password.`
        );
        return res
          .status(401)
          .send({ message: "You entered a wrong password." });
      }
    });
  } catch (error) {
    logger.error("An error occurred during login process", error);
    return res.status(500).send({
      message:
        "An error has occurred while logging in. Please try again later.",
    });
  }
};

export default { login };
