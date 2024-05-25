import User from "../models/userModel.js";

const getProfile = async (_id) => {
  try {
    const foundProfile = await User.findOne({ _id });
    return foundProfile;
  } catch (error) {
    throw new Error(error);
  }
};

const changeEmailAddress = async (userId, newEmailAddress) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { emailAddress: newEmailAddress } }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
  } catch (error) {
    throw new Error(error);
  }
};

const updateProfile = async (userId, newData) => {
  try {
    await User.updateOne({ _id: userId }, { $set: newData });
  } catch (error) {
    throw new Error(error);
  }
};

const updateProfilePicture = async (userId, photoURL) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { photoURL } });
  } catch (error) {
    throw new Error(error);
  }
};

const removeProfilePicture = async (userId, photoURL) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { photoURL: "http://localhost:8080/pictures/defaultPhoto.png" } }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getProfile,
  changeEmailAddress,
  changePassword,
  updateProfile,
  updateProfilePicture,
  removeProfilePicture,
};
