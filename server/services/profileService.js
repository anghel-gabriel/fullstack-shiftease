import User from "../models/userModel.js";

const changeEmailAddress = async (userId, newEmailAddress) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { emailAddress: newEmailAddress } }
    );
    console.log("Email address updated successfully");
  } catch (error) {
    console.error("Error updating email address:", error);
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { password: newPassword } });
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

const updateProfile = async (userId, newData) => {
  try {
    await User.updateOne({ _id: userId }, { $set: newData });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const updateProfilePicture = async (userId, photoURL) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { photoURL } });
    console.log("Profile picture updated successfully");
  } catch (error) {
    console.error("Error updating profile picture:", error);
  }
};

const removeProfilePicture = async (userId, photoURL) => {
  try {
    await User.updateOne(
      { _id: userId },
      { $set: { photoURL: "http://localhost:8080/pictures/defaultPhoto.png" } }
    );
    console.log("Profile picture updated successfully");
  } catch (error) {
    console.error("Error updating profile picture:", error);
  }
};

export default {
  changeEmailAddress,
  changePassword,
  updateProfile,
  updateProfilePicture,
  removeProfilePicture,
};
