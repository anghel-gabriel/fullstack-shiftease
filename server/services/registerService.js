import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";

const register = async (userData) => {
  try {
    await User.create(userData);
  } catch (error) {}
};

const checkEmailAddressExisting = async (emailAddress) => {
  return !!(await User.find({ emailAddress: emailAddress })).length;
};

const checkUsernameExisting = async (username) => {
  return !!(await User.find({ username: username })).length;
};

export default { register, checkEmailAddressExisting, checkUsernameExisting };
