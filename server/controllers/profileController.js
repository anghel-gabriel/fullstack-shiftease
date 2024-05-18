import profileService from "../services/profileService.js";
import registerService from "../services/registerService.js";
import { isEmailValid, isPasswordValid } from "../utils/validation.js";
import bcrypt from "bcrypt";

// This function is used by users to change their own email address
const changeEmailAddress = async (req, res) => {
  const { emailAddress } = req.body;
  const userId = req.tokenData.id;

  try {
    if (!isEmailValid(emailAddress))
      return res
        .status(400)
        .send("The email address doesn't respect the requested format.");

    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);

    if (isEmailAddressAlreadyExisting) {
      console.log("Email address already existing");
      return res.status(400).send("Chosen email address is already existing.");
    }
    await profileService.changeEmailAddress(userId, emailAddress);
    res.status(200).send();
  } catch (error) {
    console.log(error);
    // TODO: handle error
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
        res.status(500).send("An error has occured while registering.");
      } else {
        await profileService.changePassword(userId, hash);
        res.status(200).send("New user was added to database.");
      }
    } catch (error) {
      console.log(error);
      // TODO: handle error
    }
  });
};

// This function is used by users to change their own profile data
const updateProfile = async (req, res) => {
  const { username, firstName, lastName, birthDate, gender } = req.body;
  const userId = req.tokenData.id;
  try {
    const isUsernameAlreadyExisting =
      await registerService.checkUsernameExisting(username);

    if (isUsernameAlreadyExisting) {
      return res
        .status(409)
        .send("This username is already in use. Please choose another one.");
    }
    await profileService.updateProfile(userId, {
      username,
      firstName,
      lastName,
      birthDate,
      gender,
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    // TODO: handle error
  }
};

export default { changeEmailAddress, changePassword, updateProfile };
