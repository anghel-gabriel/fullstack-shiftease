import User from "../models/userModel.js";

const getUserByEmailAddress = async (emailAddress) => {
  User.find({ emailAddress });
};

export default { getUserByEmailAddress };
