import User from "../models/userModel.js";

const findUserById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user with ID ${userId}.`);
  }
};

export default {
  findUserById,
};
