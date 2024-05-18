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

export default { changeEmailAddress, changePassword };
