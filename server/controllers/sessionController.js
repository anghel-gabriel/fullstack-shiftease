import jwt from "jsonwebtoken";
import sessionService from "../services/sessionService.js";
import { logger } from "../app.js";

// This function is used to clear LOGIN_INFO cookie
const logOut = async (req, res) => {
  res.clearCookie("LOGIN_INFO");
  logger.info("User logged out successfully. LOGIN_INFO cookie cleared.");
  return res.status(200).send({ message: "Cookies cleared successfully" });
};

/* 
This function is used to check cookies when accessing the website
or refreshing the page
*/
const validateSession = async (req, res) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) {
    logger.warn("Authentication token is missing in validateSession request.");
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  }
  try {
    // Get user data
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = deserializedToken.id;
    const userData = await sessionService.findUserById(userId);
    logger.info(`User data retrieved successfully for user ID: ${userId}`);
    // Sending data
    return res.status(200).send({
      message: "Data retrieved successfully",
      data: {
        _id: userData._id,
        username: userData.username,
        emailAddress: userData.emailAddress,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        userRole: userData.userRole,
        photoURL: userData.photoURL,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      logger.warn("Invalid token provided in validateSession request.");
      return res.status(401).send({ message: "Invalid token." });
    } else {
      logger.error("Unauthorized access attempt detected.", error);
      return res.status(403).send({ message: "Unauthorized access!" });
    }
  }
};

export default { logOut, validateSession };
