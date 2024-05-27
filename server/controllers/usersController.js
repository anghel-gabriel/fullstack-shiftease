import usersService from "../services/usersService.js";
import registerService from "../services/registerService.js";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../");

// REGULAR USERS

// This function is used by users to change their own profile data
const updateProfile = async (req, res) => {
  const { username, firstName, lastName, birthDate, gender } = req.body;
  const reqUserId = req.tokenData.id;

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

    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// This function is used by users update their profile picture
const updateProfilePicture = async (req, res) => {
  const userId = req.tokenData.id;
  if (req.file) {
    const photoURL = `${req.protocol}://${req.get("host")}/pictures/${
      req.file.filename
    }`;
    try {
      await usersService.updateProfilePicture(userId, photoURL);
      res
        .status(200)
        .json({ message: "File uploaded successfully", photoURL: photoURL });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
};

// This function is used by users to change their own email address
const changeEmailAddress = async (req, res) => {
  const { emailAddress } = req.body;
  const userId = req.tokenData.id;

  try {
    if (!isEmailValid(emailAddress)) {
      return res
        .status(400)
        .send("The email address doesn't respect the requested format.");
    }

    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);

    if (isEmailAddressAlreadyExisting) {
      return res.status(400).send("Chosen email address is already existing.");
    }
    await usersService.changeEmailAddress(userId, emailAddress);
    res.status(200).send({ message: "Email address updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// This function is used by users to change their own password
const changePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.tokenData.id;

  if (!isPasswordValid(password)) {
    return res
      .status(400)
      .send("The password doesn't respect the requested format.");
  }
  bcrypt.hash(password, 8, async (err, hash) => {
    try {
      if (err) {
        res.status(500).send("An error has occurred while registering.");
      } else {
        await usersService.changePassword(userId, hash);
        res.status(200).send("Password updated successfully.");
      }
    } catch (error) {
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
          return res.status(500).json({ message: "Internal server error" });
        }
        return res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
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
    res
      .status(200)
      .send({ message: "Profile data fetched successfully", data: userData });
  } catch (error) {
    res
      .status(400)
      .send({ message: "An error has occurred while getting shifts." });
  }
};

// This function is used by admins to get all users (employees)
const getAllUsers = async (req, res) => {
  try {
    const foundUsers = await usersService.getAllUsers();
    res
      .status(200)
      .send({ message: "Users fetched successfully!", data: foundUsers });
  } catch (error) {
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
    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// This functions is used by admins to upload new profile photos
const updateProfilePictureAsAdmin = async (req, res) => {
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);

  const photoURL = `${req.protocol}://${req.get("host")}/pictures/${
    req.file.filename
  }`;
  try {
    await usersService.updateProfilePicture(userId, photoURL);
    return res
      .status(200)
      .json({ message: "File uploaded successfully", photoURL });
  } catch (error) {
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
    return res.status(400).json({ message: "photoURL is required" });
  }

  try {
    // Update the user's profile picture URL to the default one
    await usersService.removeProfilePicture(userId);

    // Extract the filename from the photoURL
    const filename = path.basename(photoURL);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Adjust the file path to the actual location of the stored files
    const filePath = path.join(__dirname, "../pictures", filename);

    // Log file path information for debugging
    console.log("photoURL:", photoURL);
    console.log("filename:", filename);
    console.log("filePath:", filePath);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      console.warn("File not found:", filePath);
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error during file removal:", error);
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
