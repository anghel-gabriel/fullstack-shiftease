import jwt from "jsonwebtoken";
import { logger } from "../app.js";

const checkUserIsAuthenticated = (req, res, next) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) {
    logger.warn("Authentication token is missing.");
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  }
  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = deserializedToken;
    logger.info(`User authenticated with ID: ${req.tokenData.id}`);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      logger.warn("Invalid authentication token.");
      return res.status(401).send({ message: "Invalid token." });
    } else {
      logger.error("Unauthorized access attempt.", error);
      return res.status(403).send({ message: "Unauthorized access!" });
    }
  }
};

const checkUserIsAdmin = (req, res, next) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) {
    logger.warn("Authentication token is missing.");
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  }
  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = deserializedToken;
    if (req.tokenData.userRole !== "admin") {
      logger.warn(
        `Access forbidden: User ID ${req.tokenData.id} is not an admin.`
      );
      return res.status(403).send({ message: "Forbidden: Admins only." });
    }
    logger.info(`Admin access granted to user ID: ${req.tokenData.id}`);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      logger.warn("Invalid authentication token.");
      return res.status(401).send({ message: "Invalid token." });
    } else {
      logger.error("Unauthorized access attempt.", error);
      return res.status(403).send({ message: "Unauthorized access!" });
    }
  }
};

export default {
  checkUserIsAuthenticated,
  checkUserIsAdmin,
};
