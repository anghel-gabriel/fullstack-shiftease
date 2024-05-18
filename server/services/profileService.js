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
    console.log("Email address updated successfully");
  } catch (error) {
    console.error("Error updating email address:", error);
  }
};

export default { changeEmailAddress, changePassword };
