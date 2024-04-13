import jwt from "jsonwebtoken";

const checkUserIsAuthenticated = (req, res, next) => {
  console.log("I am in checkUserIsAuthenticated middleware.");
  const token = req.headers.authorization;
  try {
    const deserializedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (deserializedToken) {
      req.tokenData = deserializedToken;
      next();
    }
  } catch (error) {
    res.send(403, "Unauthorized access!");
  }
};

const checkUserIsAdmin = (req, res, next) => {};

export default {
  checkUserIsAuthenticated,
};
