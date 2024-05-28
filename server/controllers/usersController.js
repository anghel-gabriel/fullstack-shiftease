import usersService from "../services/usersService.js";
import registerService from "../services/registerService.js";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { logger } from "../app.js";
import { isUsernameValid } from "../utils/validation.js";
import { isUserAgeBetween6And130 } from "../utils/validation.js";
import { validateGender } from "../utils/validation.js";

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../");

// REGULAR USERS

// This function is used by users to change their own profile data
const updateProfile = async (req, res) => {
  const { username, firstName, lastName, birthDate, gender } = req.body;
  const reqUserId = req.tokenData.id;

  // Validation
  if (!username) {
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

  try {
    let isUsernameTheSame = false;
    let isUsernameAlreadyExisting = false;
    const actualUserData = await usersService.getProfile(reqUserId);

    // If username is the same, we don't check if it already exists
    if (actualUserData.username === username) isUsernameTheSame = true;

    // If it is a new username, we check the availability
    if (!isUsernameTheSame)
      isUsernameAlreadyExisting = await registerService.checkUsernameExisting(
        username
      );

    if (isUsernameAlreadyExisting) {
      logger.warn(`Username already in use: ${username}`);
      return res.status(409).send({
        message: "This username is already in use. Please choose another one.",
      });
    }
    await usersService.updateProfile(reqUserId, {
      username,
      firstName,
      lastName,
      birthDate,
      gender,
    });

    logger.info(`Profile updated successfully for user ID: ${reqUserId}`);
    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    logger.error("Error updating profile", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// This function is used by users to update their profile picture
const updateProfilePicture = async (req, res) => {
  const userId = req.tokenData.id;
  if (req.file) {
    const photoURL = `${req.protocol}://${req.get("host")}/pictures/${
      req.file.filename
    }`;
    try {
      await usersService.updateProfilePicture(userId, photoURL);
      logger.info(
        `Profile picture updated successfully for user ID: ${userId}`
      );
      res
        .status(200)
        .json({ message: "File uploaded successfully", photoURL: photoURL });
    } catch (error) {
      logger.error("Error updating profile picture", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    logger.warn("No file uploaded for profile picture update.");
    res.status(400).json({ message: "No file uploaded" });
  }
};

// This function is used by users to change their own email address
const changeEmailAddress = async (req, res) => {
  const { emailAddress } = req.body;
  const userId = req.tokenData.id;

  try {
    if (!isEmailValid(emailAddress)) {
      logger.warn("Invalid email format provided.");
      return res
        .status(400)
        .send("The email address doesn't respect the requested format.");
    }

    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);

    if (isEmailAddressAlreadyExisting) {
      logger.warn(`Email address already in use: ${emailAddress}`);
      return res.status(400).send("Chosen email address is already existing.");
    }
    await usersService.changeEmailAddress(userId, emailAddress);
    logger.info(`Email address updated successfully for user ID: ${userId}`);
    res.status(200).send({ message: "Email address updated successfully" });
  } catch (error) {
    logger.error("Error updating email address", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// This function is used by users to change their own password
const changePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.tokenData.id;

  if (!isPasswordValid(password)) {
    logger.warn("Invalid password format provided.");
    return res
      .status(400)
      .send("The password doesn't respect the requested format.");
  }
  bcrypt.hash(password, 8, async (err, hash) => {
    try {
      if (err) {
        logger.error("Error hashing password", err);
        res.status(500).send("An error has occurred while registering.");
      } else {
        await usersService.changePassword(userId, hash);
        logger.info(`Password updated successfully for user ID: ${userId}`);
        res.status(200).send("Password updated successfully.");
      }
    } catch (error) {
      logger.error("Error updating password", error);
      res.status(500).send("Internal server error");
    }
  });
};

const deleteProfilePicture = async (req, res) => {
  const { photoURL } = req.body;
  const userId = req.tokenData.id; // Assuming userId is available in tokenData

  if (
    !photoURL ||
    photoURL === "http://localhost:8080/pictures/defaultPhoto.png"
  ) {
    logger.warn("Invalid photoURL provided for profile picture deletion.");
    return res.status(400).json({ message: "photoURL is required" });
  }

  try {
    // Update the user's profile picture URL to the default one
    await usersService.removeProfilePicture(userId);

    // Extract the filename from the photoURL
    const filename = path.basename(photoURL);
    const filePath = path.join(rootDir, "pictures", filename);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.error("Error deleting profile picture file", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        logger.info(
          `Profile picture removed successfully for user ID: ${userId}`
        );
        return res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      logger.warn(`File not found: ${filePath}`);
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    logger.error("Error removing profile picture", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ADMIN USERS

// This function is used by admins to get any user's profile data
const getUser = async (req, res) => {
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);
  try {
    const userData = await usersService.getProfile(userId);
    logger.info(`Profile data fetched successfully for user ID: ${userId}`);
    res
      .status(200)
      .send({ message: "Profile data fetched successfully", data: userData });
  } catch (error) {
    logger.error("Error fetching user profile data", error);
    res
      .status(400)
      .send({ message: "An error has occurred while getting shifts." });
  }
};

// This function is used by admins to get all users (employees)
const getAllUsers = async (req, res) => {
  try {
    const foundUsers = await usersService.getAllUsers();
    logger.info("All users fetched successfully.");
    res
      .status(200)
      .send({ message: "Users fetched successfully!", data: foundUsers });
  } catch (error) {
    logger.error("Error fetching all users", error);
    res
      .status(400)
      .send({ message: "An error has occurred while getting shifts." });
  }
};

// This function is used by admins to change their own profile data
const updateProfileAsAdmin = async (req, res) => {
  const { username, firstName, lastName, birthDate, gender } = req.body;
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);

  try {
    let isUsernameTheSame = false;
    let isUsernameAlreadyExisting = false;
    const actualUserData = await usersService.getProfile(userId);

    // If username is the same, we don't check if it already exists
    if (actualUserData.username === username) isUsernameTheSame = true;

    // If it is a new username, we check the availability
    if (!isUsernameTheSame)
      isUsernameAlreadyExisting = await registerService.checkUsernameExisting(
        username
      );

    if (isUsernameAlreadyExisting) {
      logger.warn(`Username already in use: ${username}`);
      return res.status(409).send({
        message: "This username is already in use. Please choose another one.",
      });
    }
    await usersService.updateProfile(userId, {
      username,
      firstName,
      lastName,
      birthDate,
      gender,
    });
    logger.info(`Profile updated successfully by admin for user ID: ${userId}`);
    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    logger.error("Error updating profile by admin", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// This function is used by admins to upload new profile photos
const updateProfilePictureAsAdmin = async (req, res) => {
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);

  const photoURL = `${req.protocol}://${req.get("host")}/pictures/${
    req.file.filename
  }`;
  try {
    await usersService.updateProfilePicture(userId, photoURL);
    logger.info(
      `Profile picture updated successfully by admin for user ID: ${userId}`
    );
    return res
      .status(200)
      .json({ message: "File uploaded successfully", photoURL });
  } catch (error) {
    logger.error("Error updating profile picture by admin", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProfilePictureAsAdmin = async (req, res) => {
  const { photoURL, employeeId } = req.body;
  const userId = ObjectId.createFromHexString(employeeId);

  if (
    !photoURL ||
    photoURL === "http://localhost:8080/pictures/defaultPhoto.png"
  ) {
    logger.warn(
      "Invalid photoURL provided for admin profile picture deletion."
    );
    return res.status(400).json({ message: "photoURL is required" });
  }

  try {
    // Update the user's profile picture URL to the default one
    await usersService.removeProfilePicture(userId);

    // Extract the filename from the photoURL
    const filename = path.basename(photoURL);
    const filePath = path.join(rootDir, "pictures", filename);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.error("Error deleting profile picture file by admin", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        logger.info(
          `Profile picture removed successfully by admin for user ID: ${userId}`
        );
        res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      logger.warn(`File not found for deletion: ${filePath}`);
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    logger.error("Error removing profile picture by admin", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  changeEmailAddress,
  changePassword,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  getUser,
  updateProfileAsAdmin,
  updateProfilePictureAsAdmin,
  deleteProfilePicture,
  deleteProfilePictureAsAdmin,
};
