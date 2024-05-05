import bcrypt from "bcrypt";
import registerService from "../services/registerService.js";
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
  isUserAgeBetween6And130,
} from "../utils/validation.js";

// This is used to verify is gender is chosen from the list
const genderOptionList = [
  { name: "Unknown", value: "unknown" },
  { name: "Male", value: "male" },
  { name: "Female", value: "female" },
  { name: "Other", value: "other" },
];
const validateGender = (gender) => {
  return genderOptionList.some(
    (option) => option.value === gender.value && option.name === gender.name
  );
};

/* 
This is used for the first step of the register form. 
It checks if username or email address is already existing 
*/
const checkCredentials = async (req, res) => {
  // Getting request data
  const { username, emailAddress, password, confirmPassword } = req.body;

  // Validation
  if (!username || !emailAddress || !password || !confirmPassword) {
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

  // Check if username or email address is already existing
  try {
    const isEmailAddressAlreadyExisting =
      await registerService.checkEmailAddressExisting(emailAddress);
    const isUsernameAlreadyExisting =
      await registerService.checkUsernameExisting(username);
    if (isEmailAddressAlreadyExisting) {
      res
        .status(409)
        .send(
          "This email address is already in use. Please choose another one."
        );
    } else if (isUsernameAlreadyExisting) {
      res
        .status(409)
        .send("This username is already in use. Please choose another one.");
    } else {
      res.status(200).send();
    }
  } catch (error) {
    res.status(500).send("An error has occured. Please try again.");
  }
};

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
    return res.status(400).send("Please fill al the mandatory fields.");
  }

  /* 
  I use the same validation process for checking credentials. This approach prevents users from bypassing validation by only using the registration endpoint. By enforcing the same checks at both stages, I can more reliably prevent unauthorized or improperly formatted data from entering our system. 
  */
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

  if (firstName.length < 2 || lastName.length < 2)
    return res
      .status(400)
      .send("First name and last name must be at least 2 characters long.");

  if (!isUserAgeBetween6And130(birthDate))
    return res
      .status(400)
      .send("User must be between 6 and 130 years old in order to register.");

  if (!validateGender(gender))
    return res.status(400).send("The gender provided is invalid.");

  bcrypt.hash(password, 8, async (err, hash) => {
    const userData = {
      username: username,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      gender: gender,
      password: hash,
      userRole: "admin",
    };

    try {
      const isEmailAddressAlreadyExisting =
        await registerService.checkEmailAddressExisting(emailAddress);
      const isUsernameAlreadyExisting =
        await registerService.checkUsernameExisting(username);
      if (isEmailAddressAlreadyExisting) {
        return res
          .status(409)
          .send(
            "This email address is already in use. Please choose another one."
          );
      } else if (isUsernameAlreadyExisting) {
        return res
          .status(409)
          .send("This username is already in use. Please choose another one.");
      }
      await registerService.register(userData);
      if (err) {
        res.status(500).send("An error has occured while registering.");
      } else {
        res.status(200).send("New user was added to database.");
      }
    } catch (error) {
      res.status(500).send("An error has occured while registering.");
    }
  });
};

export default { registerUser, checkCredentials };
