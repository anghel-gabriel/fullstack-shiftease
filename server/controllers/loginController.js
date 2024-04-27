import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginService from "../services/loginService.js";

const login = async (req, res) => {
  // getting body data
  const { usernameOrEmail, password, loginMethod } = req.body;

  console.log(usernameOrEmail, password, loginMethod);

  if (!usernameOrEmail || !password || !loginMethod)
    return res.status(400).send("Bad request.");

  try {
    // looking for the user in database
    let foundUsers;
    if (loginMethod === "email")
      foundUsers = await loginService.getUserByEmailAddress(usernameOrEmail);
    else if (loginMethod === "username")
      foundUsers = await loginService.getUserByUsername(usernameOrEmail);
    // TODO: choose another message
    else res.status(400).send("Please select a login method.");

    console.log("login method", loginMethod);
    console.log("username or email", usernameOrEmail);
    console.log("password", password);
    console.log(foundUsers);

    if (!foundUsers || !foundUsers.length)
      return res
        .status(400)
        .send(`Account with entered ${loginMethod} doesn't exist.`);
    const userPassword = foundUsers[0].password;
    // checking if entered password is equal to 'decrypted' hash password from database
    bcrypt.compare(password, userPassword, (err, result) => {
      if (result) {
        const user = foundUsers[0];
        const data = {
          id: user._id,
        };
        const token = jwt.sign(data, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        res.send(200, {
          status: 200,
          bearer: token,
          user: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            birthDate: user.birthDate,
            gender: user.gender.value,
          },
        });
      } else {
        console.log("eroare", err);
        res.status(401).send("You entered a wrong password.");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error has occured while logging in.");
  }
};

export default { login };
