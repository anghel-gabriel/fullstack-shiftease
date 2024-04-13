import Shift from "../models/shiftModel.js";

const deleteShift = async (shiftId) => {
  return await Shift.findByIdAndDelete(shiftId);
};

export default { deleteShift };
