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
        const data = {
          id: foundUsers[0]._id,
        };
        const token = jwt.sign(data, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        res.send(200, {
          status: 200,
          bearer: token,
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
