import User from "../models/userModel.js";

const register = async (userData) => {
  User.create(userData);
};

export default { register };
