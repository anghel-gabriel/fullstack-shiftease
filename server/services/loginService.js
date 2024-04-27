import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  return await User.find({ emailAddress });
};

const getUserByUsername = async (username) => {
  return await User.find({ username: username });
};

export default { getUserByEmailAddress, getUserByUsername };
