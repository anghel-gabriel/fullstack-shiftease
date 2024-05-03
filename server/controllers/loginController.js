import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import loginService from "../services/loginService.js";

const login = async (req, res) => {
  // getting body data
  const { usernameOrEmail, password, loginMethod } = req.body;

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

        res.cookie("LOGIN_INFO", token, {
          // can only be accessed by server requests
          httpOnly: true,
          // path = where the cookie is valid
          // path: "/",
          // // domain = what domain the cookie is valid on
          // domain: "localhost",
          // // secure = only send cookie over https
          // secure: false,
          // // sameSite = only send cookie if the request is coming from the same origin
          // sameSite: "lax", // "strict" | "lax" | "none" (secure must be true)
          // // maxAge = how long the cookie is valid for in milliseconds
          maxAge: 3333600000, // 1 hour
        });

        console.log(user);

        res.status(200).send({
          status: 200,
          bearer: token,
          user: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            birthDate: user.birthDate,
            gender: user.gender.value,
            userRole: user.userRole,
          },
        });
      } else {
        res.status(401).send("You entered a wrong password.");
      }
    });
  } catch (error) {
    res.status(500).send("An error has occured while logging in.");
  }
};

export default { login };
