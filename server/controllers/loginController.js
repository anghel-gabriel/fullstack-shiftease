import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginService from "../services/loginService.js";

const login = async (req, res) => {
  // getting body data
  // #TODO: get user data by login method
  const { username, emailAddress, password } = req.body;
  // #TODO: data validation
  // -----
  try {
    // looking for the user in database
    const foundUsers = await loginService.getUserByEmailAddress(emailAddress);
    if (!foundUsers && !foundUsers.length)
      return res.status(400).send("Username or password is not correct.");
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
        res.status(401).send("The username or password was not correct");
      }
    });
  } catch (error) {
    res.status(500).send("An error has occured while logging in.");
  }
};

export default { login };
