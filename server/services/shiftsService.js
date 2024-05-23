import Shift from "../models/shiftModel.js";

const addShift = async (shiftData) => {
  try {
    await Shift.create(shiftData);
  } catch (error) {
    throw new Error(error);
  }
};

const updateShiftById = async (_id, author, newData) => {
  try {
    // userId is used to ensure that the author of the shift is the logged-in user
    await Shift.findOneAndUpdate({ _id, author }, newData);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteShiftById = async (_id, author) => {
  try {
    // userId is used to ensure that the author of the shift is the logged-in user
    await Shift.deleteOne({ _id, author });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserShifts = async (author) => {
  try {
    const shifts = await Shift.find({ author });
    return shifts;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllShifts = async () => {
  console.log("pe toate");
  try {
    const allShifts = await Shift.find();
    return allShifts;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteShiftByShiftIdAndUserId = async (shiftId, userId) => {
  const result = await Shift.deleteOne({ _id: shiftId, author: userId });
  return result;
};

const deleteUserShifts = async (userId) => {
  return await Shift.deleteMany({ author: userId });
};

export default {
  addShift,
  updateShiftById,
  deleteShiftByShiftIdAndUserId,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
  deleteShiftById,
};
