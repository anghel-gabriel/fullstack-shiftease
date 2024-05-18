import Shift from "../models/shiftModel.js";

const addShift = async (shiftData) => {
  return await Shift.create(shiftData);
};

// Get all shifts by user id
const getUserShifts = async (userId) => {
  return Shift.find({ author: userId });
};

const getShiftById = async (shiftId) => {
  return await Shift.findById(shiftId);
};

const getAllShifts = async () => {
  return await Shift.find();
};

const updateShiftById = async (shiftId, newData) => {
  return await Shift.findByIdAndUpdate(shiftId, newData);
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
