import User from "../models/userModel.js";

const getProfile = async (_id) => {
  try {
    const foundProfile = await User.findOne({ _id });
    return foundProfile;
  } catch (error) {
    throw new Error(`Error fetching profile with ID ${_id}.`);
  }
};

const changeEmailAddress = async (userId, newEmailAddress) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { emailAddress: newEmailAddress } }
    );
  } catch (error) {
    throw new Error(
      `Error changing email address for user ID ${userId} to ${newEmailAddress}.`
    );
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
  } catch (error) {
    throw new Error(`Error changing password for user ID ${userId}.`);
  }
};

const updateProfile = async (userId, newData) => {
  try {
    await User.updateOne({ _id: userId }, { $set: newData });
  } catch (error) {
    throw new Error(`Error updating profile for user ID ${userId}.`);
  }
};

const updateProfilePicture = async (userId, photoURL) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { photoURL } });
  } catch (error) {
    throw new Error(`Error updating profile picture for user ID ${userId}.`);
  }
};

const removeProfilePicture = async (userId) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { photoURL: "http://localhost:8080/pictures/defaultPhoto.png" } }
    );
  } catch (error) {
    throw new Error(`Error removing profile picture for user ID ${userId}.`);
  }
};

const getAllUsers = async () => {
  try {
    const allUsers = await User.find({});
    return allUsers;
  } catch (error) {
    throw new Error(`Error fetching all users.`);
  }
};

export default {
  getProfile,
  changeEmailAddress,
  changePassword,
  updateProfile,
  updateProfilePicture,
  removeProfilePicture,
  getAllUsers,
};
