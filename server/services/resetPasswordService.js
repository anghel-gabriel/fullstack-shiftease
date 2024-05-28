import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  try {
    const user = await User.findOne({ emailAddress });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user with email address ${emailAddress}.`);
  }
};

const setPassword = async (userId, newPassword) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
  } catch (error) {
    throw new Error(`Error setting new password for user ID ${userId}.`);
  }
};

export default { setPassword, getUserByEmailAddress };
