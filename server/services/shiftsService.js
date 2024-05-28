import Shift from "../models/shiftModel.js";

// REGULAR USERS
const getUserShifts = async (author) => {
  try {
    const shifts = await Shift.find({ author });
    return shifts;
  } catch (error) {
    throw new Error(`Error fetching shifts for user with author ID ${author}.`);
  }
};

const addShift = async (shiftData) => {
  try {
    await Shift.create(shiftData);
  } catch (error) {
    throw new Error(`Error adding shift.`);
  }
};

const updateShiftById = async (_id, author, newData) => {
  try {
    // userId is used to ensure that the author of the shift is the logged-in user
    await Shift.findOneAndUpdate({ _id, author }, newData);
  } catch (error) {
    throw new Error(
      `Error updating shift with ID ${_id} for user with author ID ${author}.`
    );
  }
};

const deleteShiftByIdAndAuthor = async (_id, author) => {
  try {
    // userId is used to ensure that the logged user is the author of the shift
    await Shift.deleteOne({ _id, author });
  } catch (error) {
    throw new Error(
      `Error deleting shift with ID ${_id} for user with author ID ${author}.`
    );
  }
};

// ADMIN USERS
const getAllShifts = async () => {
  try {
    const allShifts = await Shift.find().populate(
      "author",
      "firstName lastName"
    );
    const transformedShifts = allShifts.map((shift) => ({
      ...shift.toJSON(),
      authorFullName: `${shift.author.firstName} ${shift.author.lastName}`,
      authorId: shift.author._id,
    }));
    return transformedShifts;
  } catch (error) {
    throw new Error(`Error fetching all shifts.`);
  }
};

const updateShiftByIdAsAdmin = async (_id, newData) => {
  try {
    await Shift.findOneAndUpdate({ _id }, newData);
  } catch (error) {
    throw new Error(`Error updating shift with ID ${_id} as admin.`);
  }
};

const deleteShiftAsAdmin = async (shiftId, userId) => {
  try {
    await Shift.deleteOne({ _id: shiftId });
  } catch (error) {
    throw new Error(`Error deleting shift with ID ${shiftId} as admin.`);
  }
};

const deleteUserShifts = async (userId) => {
  try {
    await Shift.deleteMany({ author: userId });
  } catch (error) {
    throw new Error(`Error deleting shifts for user with author ID ${userId}.`);
  }
};

export default {
  addShift,
  updateShiftById,
  deleteShiftAsAdmin,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
  deleteShiftByIdAndAuthor,
  updateShiftByIdAsAdmin,
};
