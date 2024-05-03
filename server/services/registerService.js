import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";

const register = async (userData) => {
  try {
    console.log("in registerservice", userData);
    await User.create(userData);
  } catch (error) {
    console.log(error);
  }
};

const checkEmailAddressExisting = async (emailAddress) => {
  return !!(await User.find({ emailAddress: emailAddress })).length;
};

const checkUsernameExisting = async (username) => {
  return !!(await User.find({ username: username })).length;
};

export default { register, checkEmailAddressExisting, checkUsernameExisting };
