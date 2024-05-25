import profileService from "../services/profileService.js";
import registerService from "../services/registerService.js";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

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
      isUsernameAlreadyExisting =
        await registerService.checkUsernameExisting(username);

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
      console.log("Email address already existing");
      return res.status(400).send("Chosen email address is already existing.");
    }
    await profileService.changeEmailAddress(userId, emailAddress);
    res.status(200).send({ message: "Email address updated successfully" });
  } catch (error) {
    console.log(error);
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
      console.log(error);
      res.status(500).send("Internal server error");
    }
  });
};

// This function is used by users to update their profile photo
const updateProfilePicture = async (userId, photoURL) => {
  try {
    await profileService.updateProfilePicture(userId, photoURL);
    console.log("Profile picture updated successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile picture");
  }
};

export default {
  changeEmailAddress,
  changePassword,
  updateProfile,
  updateProfilePicture,
};
