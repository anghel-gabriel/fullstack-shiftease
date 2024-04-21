import Shift from "../models/shiftModel.js";

const addShift = async (shiftData) => {
  return await Shift.create(shiftData);
};

// get shifts by user id
const getUserShifts = async (userId) => {
  return Shift.find({ startTime: "azi" });
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

const deleteShift = async (shiftId) => {
  return await Shift.findByIdAndDelete(shiftId);
};

const deleteUserShifts = async (userId) => {
  return await Shift.deleteMany({ author: userId });
};

export default {
  getShiftById,
  addShift,
  updateShiftById,
  deleteShift,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
};
