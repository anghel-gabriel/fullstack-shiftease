import profileService from "../services/profileService.js";
import registerService from "../services/registerService.js";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { upload } from "../routes/userRoutes/uploadRouter.js";

// REGULAR USERS

// This function is used by users to change their own profile data
const updateProfile = async (req, res) => {
  const { username, firstName, lastName, birthDate, gender } = req.body;
  const reqUserId = req.tokenData.id;

  try {
    let isUsernameTheSame = false;
    let isUsernameAlreadyExisting = false;
    const actualUserData = await profileService.getProfile(reqUserId);

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
    await profileService.updateProfile(reqUserId, {
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
    await profileService.changeEmailAddress(userId, emailAddress);
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
        await profileService.changePassword(userId, hash);
        res.status(200).send("Password updated successfully.");
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });
};

// This function is used by users to update their profile photo
const updateProfilePicture = async (userId, photoURL) => {
  try {
    await profileService.updateProfilePicture(userId, photoURL);
  } catch (error) {
    throw new Error("Error updating profile picture");
  }
};

// ADMIN USERS

// This function is used by admins to get any user's profile data
const getUser = async (req, res) => {
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);
  try {
    const userData = await profileService.getProfile(userId);
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
    const foundUsers = await profileService.getAllUsers();
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
    const actualUserData = await profileService.getProfile(userId);

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
    await profileService.updateProfile(userId, {
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
    await profileService.updateProfilePicture(userId, photoURL);
    return res
      .status(200)
      .json({ message: "File uploaded successfully", photoURL });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
};
