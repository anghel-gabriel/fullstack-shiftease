import Shift from "../models/shiftModel.js";

const addShift = async (shiftData) => {
  return await Shift.create(shiftData);
};

const getShiftById = async (shiftId) => {
  return await Shift.findById(shiftId);
};

const updateShiftById = async (shiftId, newData) => {
  return await Shift.findByIdAndUpdate(shiftId, newData);
};

const deleteShift = async (shiftId) => {
  return await Shift.findByIdAndDelete(shiftId);
};

export default { getShiftById, addShift, updateShiftById, deleteShift };
