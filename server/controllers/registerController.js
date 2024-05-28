import bcrypt from "bcrypt";
import registerService from "../services/registerService.js";
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../utils/validation.js";
import { validateGender } from "../utils/validation.js";
import { logger } from "../app.js";

/* 
This is used for the first step of the register form. 
It checks if username or email address is already existing 
*/
const checkCredentials = async (req, res) => {
  // Getting request data
  const { username, emailAddress, password, confirmPassword } = req.body;

  // Validation
  if (!username || !emailAddress || !password || !confirmPassword) {
    logger.warn("Registration check attempt with missing mandatory fields.");
    return res
      .status(400)
      .send({ message: "Please fill all the mandatory fields." });
  }

  if (username.length < 6) {
    logger.warn("Username too short during registration check.");
    return res
      .status(400)
      .send({ message: "Username must be at least 6 characters long." });
  }

  if (!isUsernameValid(username)) {
    logger.warn("Invalid username format during registration check.");
    return res.status(400).send({ message: "Username must be alphanumeric." });
  }

  if (!isEmailValid(emailAddress)) {
    logger.warn("Invalid email format during registration check.");
    return res.status(400).send({
      message: "The email address doesn't respect the requested format.",
    });
  }

  if (!isPasswordValid(password)) {
    logger.warn("Invalid password format during registration check.");
    return res
      .status(400)
      .send({ message: "Password does not respect the requested format." });
  }

  if (password !== confirmPassword) {
    logger.warn("Passwords do not match during registration check.");
    return res.status(400).send({ message: "Passwords do not match." });
  }

  // Check if username or email address is already existing
  try {
    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);
    const isUsernameAlreadyExisting =
      await registerService.checkUsernameExisting(username);
    if (isEmailAddressAlreadyExisting) {
      logger.info(
        `Email address already in use during registration check: ${emailAddress}`
      );
      return res.status(409).send({
        message:
          "This email address is already in use. Please choose another one.",
      });
    } else if (isUsernameAlreadyExisting) {
      logger.info(
        `Username already in use during registration check: ${username}`
      );
      return res.status(409).send({
        message: "This username is already in use. Please choose another one.",
      });
    } else {
      logger.info(
        "Username and email address available during registration check."
      );
      return res.status(200).send({
        message: "User with entered username and email address doesn't exist.",
      });
    }
  } catch (error) {
    logger.error("Error during registration check", error);
    return res
      .status(500)
      .send({ message: "An error has occurred. Please try again." });
  }
};

// This is used for register form submission
const registerUser = async (req, res) => {
  // Getting request data
  const {
    username,
    emailAddress,
    password,
    confirmPassword,
    firstName,
    lastName,
    birthDate,
    gender,
  } = req.body;

  // Validation
  if (
    !username ||
    !emailAddress ||
    !password ||
    !confirmPassword ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !gender
  ) {
    logger.warn("Registration attempt with missing mandatory fields.");
    return res
      .status(400)
      .send({ message: "Please fill all the mandatory fields." });
  }

  /* 
  I use the same validation process for checking credentials. This approach prevents users from bypassing validation by only using the registration endpoint. By enforcing the same checks at both stages, I can more reliably prevent unauthorized or improperly formatted data from entering our system. 
  */
  if (username.length < 6) {
    logger.warn("Username too short during registration.");
    return res
      .status(400)
      .send({ message: "Username must be at least 6 characters long." });
  }

  if (!isUsernameValid(username)) {
    logger.warn("Invalid username format during registration.");
    return res.status(400).send({ message: "Username must be alphanumeric." });
  }

  if (!isEmailValid(emailAddress)) {
    logger.warn("Invalid email format during registration.");
    return res.status(400).send({
      message: "The email address doesn't respect the requested format.",
    });
  }

  if (!isPasswordValid(password)) {
    logger.warn("Invalid password format during registration.");
    return res
      .status(400)
      .send({ message: "Password does not respect the requested format." });
  }

  if (password !== confirmPassword) {
    logger.warn("Passwords do not match during registration.");
    return res.status(400).send({ message: "Passwords do not match." });
  }

  if (firstName.length < 2 || lastName.length < 2) {
    logger.warn("First name or last name too short during registration.");
    return res.status(400).send({
      message: "First name and last name must be at least 2 characters long.",
    });
  }

  if (!isUserAgeBetween6And130(birthDate)) {
    logger.warn("Invalid age during registration.");
    return res.status(400).send({
      message: "User must be between 6 and 130 years old in order to register.",
    });
  }

  if (!validateGender(gender)) {
    logger.warn("Invalid gender provided during registration.");
    return res.status(400).send({ message: "The gender provided is invalid." });
  }

  bcrypt.hash(password, 8, async (err, hash) => {
    const userData = {
      username: username,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      gender: gender,
      password: hash,
      userRole: "user",
    };

    try {
      const isEmailAddressAlreadyExisting =
        await registerService.checkEmailAddressExisting(emailAddress);
      const isUsernameAlreadyExisting =
        await registerService.checkUsernameExisting(username);
      if (isEmailAddressAlreadyExisting) {
        logger.info(
          `Email address already in use during registration: ${emailAddress}`
        );
        return res.status(409).send({
          message:
            "This email address is already in use. Please choose another one.",
        });
      } else if (isUsernameAlreadyExisting) {
        logger.info(`Username already in use during registration: ${username}`);
        return res.status(409).send({
          message:
            "This username is already in use. Please choose another one.",
        });
      }
      if (err) {
        logger.error("Error during password hashing", err);
        return res
          .status(500)
          .send({ message: "An error has occurred while registering." });
      } else {
        await registerService.register(userData);
        logger.info(`New user registered: ${username}`);
        return res
          .status(200)
          .send({ message: "New user was added to database." });
      }
    } catch (error) {
      logger.error("Error during user registration", error);
      return res
        .status(500)
        .send({ message: "An error has occurred while registering." });
    }
  });
};

export default { registerUser, checkCredentials };
