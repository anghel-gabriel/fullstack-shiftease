import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  return await User.findOne({ emailAddress });
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username: username });
};

export default { getUserByEmailAddress, getUserByUsername };
