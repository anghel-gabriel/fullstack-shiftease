import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  try {
    const user = await User.findOne({ emailAddress });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export default { getUserByEmailAddress, getUserByUsername };
