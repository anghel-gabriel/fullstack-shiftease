import Shift from "../models/shiftModel.js";

const addShift = async (shiftData) => {
  try {
    await Shift.create(shiftData);
  } catch (error) {
    throw new Error(error);
  }
};

const updateShiftById = async (shiftId, userId, newData) => {
  try {
    // userId is used to ensure that the author of the shift is the logged-in user
    await Shift.findOneAndUpdate({ _id: shiftId, author: userId }, newData);
  } catch (error) {
    throw new Error(error);
  }
};

const getShiftById = async (shiftId) => {
  return await Shift.findById(shiftId);
};

// Get all shifts by user id
const getUserShifts = async (userId) => {
  return Shift.find({ author: userId });
};

const getAllShifts = async () => {
  return await Shift.find();
};

const deleteShiftByShiftIdAndUserId = async (shiftId, userId) => {
  const result = await Shift.deleteOne({ _id: shiftId, author: userId });
  return result;
};

const deleteShiftById = async (shiftId) => {
  const result = await Shift.deleteOne({ _id: shiftId });
  return result;
};

const deleteUserShifts = async (userId) => {
  return await Shift.deleteMany({ author: userId });
};

export default {
  getShiftById,
  addShift,
  updateShiftById,
  deleteShiftByShiftIdAndUserId,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
  deleteShiftById,
};
