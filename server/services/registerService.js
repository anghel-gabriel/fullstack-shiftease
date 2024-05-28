import User from "../models/userModel.js";

const register = async (userData) => {
  try {
    await User.create(userData);
  } catch (error) {
    throw new Error(`Error registering user.`);
  }
};

const checkEmailAddressExisting = async (emailAddress) => {
  try {
    const user = await User.find({ emailAddress: emailAddress });
    return !!user.length;
  } catch (error) {
    throw new Error(`Error checking if email address ${emailAddress} exists.`);
  }
};

const checkUsernameExisting = async (username) => {
  try {
    const user = await User.find({ username });
    return !!user.length;
  } catch (error) {
    throw new Error(`Error checking if username ${username} exists.`);
  }
};

export default { register, checkEmailAddressExisting, checkUsernameExisting };
