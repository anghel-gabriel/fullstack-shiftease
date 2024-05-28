import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  try {
    const user = await User.findOne({ emailAddress });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user with email address ${emailAddress}:.`);
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user with username ${username}.`);
  }
};

export default { getUserByEmailAddress, getUserByUsername };
