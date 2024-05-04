import jwt from "jsonwebtoken";

const checkUserIsAuthenticated = (req, res, next) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) return res.status(401).send("Authentication token is required.");

  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = deserializedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).send("Invalid token.");
    else return res.status(403).send("Unauthorized access!");
  }
};

const checkLoginStatus = (req, res, next) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) return res.status(401).send("Authentication token is required.");

  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = deserializedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).send("Invalid token.");
    else return res.status(403).send("Unauthorized access!");
  }
};

const checkUserIsAdmin = (req, res, next) => {
  const token = req.cookies["LOGIN_INFO"];
  if (!token) return res.status(401).send("Authentication token is required.");

  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = deserializedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(401).send("Invalid token.");
    else return res.status(403).send("Unauthorized access!");
  }
};

export default {
  checkUserIsAuthenticated,
  checkUserIsAdmin,
};
