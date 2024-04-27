import bcrypt from "bcrypt";
import registerService from "../services/registerService.js";
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../utils/validation.js";

const checkCredentials = async (req, res) => {
  // getting body data (first step of the form)
  const { username, emailAddress, password, confirmPassword } = req.body;

  // data validation
  if (!username || !emailAddress || !password || !confirmPassword) {
    console.log("Every field must be completed.");
    return res.status(400).send("Please fill al the mandatory fields.");
  }

  if (username.length < 6)
    return res.status(400).send("Username must be at least 6 characters long.");

  if (!isUsernameValid(username))
    return res.status(400).send("Username must be alphanumeric.");

  if (!isEmailValid(emailAddress))
    return res
      .status(400)
      .send("The email address doesn't respect the requested format.");

  if (!isPasswordValid(password))
    return res
      .status(400)
      .send("Password do not respect the requested format.");

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  // checking if entered username or email address are already existing
  try {
    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);
    const isUsernameAlreadyExisting =
      await registerService.checkUsernameExisting(username);
    if (isEmailAddressAlreadyExisting)
      res
        .status(409)
        .send(
          "This email address is already in use. Please choose another one."
        );
    else if (isUsernameAlreadyExisting)
      res
        .status(409)
        .send("This username is already in use. Please choose another one.");
    else res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("An error has occured. Please try again.");
  }
};

const registerUser = async (req, res) => {
  // getting body data
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

  // data validation
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
    console.log("Every field must be completed.");
    return res.status(400).send("Please fill al the mandatory fields.");
  }

  if (firstName.length < 2 || lastName.length < 2)
    return res
      .status(400)
      .send("First name and last name must be at least 2 characters long.");

  if (!isUserAgeBetween6And130(birthDate))
    return res
      .status(400)
      .send("User must be between 6 and 130 years old in order to register.");

  bcrypt.hash(password, 8, async (err, hash) => {
    const userData = {
      username: username,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      gender: gender,
      password: hash,
    };

    try {
      await registerService.register(userData);
      if (err) {
        console.log(err);
        res.status(500).send("An error has occured while registering.");
      } else res.status(200).send("New user was added to database.");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error has occured while registering.");
    }
  });
};

export default { registerUser, checkCredentials };
