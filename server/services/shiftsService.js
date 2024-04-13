import Shift from "../models/shiftModel.js";

const updateShiftById = async (shiftId, newData) => {
  return await Shift.findByIdAndUpdate(shiftId, newData);
};

const deleteShift = async (shiftId) => {
  return await Shift.findByIdAndDelete(shiftId);
};

export default { deleteShift, updateShiftById };
