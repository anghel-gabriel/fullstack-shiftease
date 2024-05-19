import jwt from "jsonwebtoken";
import sessionService from "../services/sessionService.js";

// This function is used to clear LOGIN_INFO cookie
const logOut = async (req, res) => {
  res.clearCookie("LOGIN_INFO");
  return res.status(200).send({ message: "Cookies cleared successfully" });
};

/* 
This function is used to check cookies when accessing the website
or refreshing the page
*/
const validateSession = async (req, res) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token)
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = deserializedToken.id;
    const userData = await sessionService.findUserById(userId);
    return res.status(200).send(userData);
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).send({ message: "Invalid token." });
    else return res.status(403).send({ message: "Unauthorized access!" });
  }
};

export default { logOut, validateSession };
