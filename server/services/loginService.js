import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  return User.find({ emailAddress });
};

export default { getUserByEmailAddress };
