import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  try {
    const user = await User.findOne({ emailAddress });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const setPassword = async (userId, newPassword) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
  } catch (error) {
    throw new Error(error);
  }
};

export default { setPassword, getUserByEmailAddress };
