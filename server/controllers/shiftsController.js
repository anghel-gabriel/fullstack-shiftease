import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";
import shiftsService from "../services/shiftsService.js";
import { ObjectId } from "mongodb";

// This function allows admin to view get all shifts
const getAllShifts = async (req, res) => {
  try {
    /* 
    The "populate" method from Mongoose is used to retrieve the firstName and lastName 
    fields from the user document referenced by the "author" property in each shift 
    object. This ensures that each shift includes the author's full name. 
    */
    const populatedShifts = await Shift.find({}).populate(
      "author",
      "firstName lastName"
    );
    const transformedShifts = populatedShifts.map((shift) => ({
      ...shift.toJSON(),
      authorFullName: `${shift.author.firstName} ${shift.author.lastName}`,
      authorId: shift.author._id,
    }));
    res.status(200).send(transformedShifts);
  } catch (error) {
    res.status(400).send("An error has occurred while getting shifts.");
  }
};

// This function is used to get all shifts by user id (author property in shift objects)
const getUserShifts = async (req, res) => {
  const id = req.tokenData.id;
  try {
    const userId = ObjectId.createFromHexString(id);
    const foundShifts = await shiftsService.getUserShifts(userId);
    res.status(200).send(foundShifts);
  } catch (error) {
    res.status(400).send("An error has occured while getting user shifts.");
  }
};

// This functions is used to add new shifts
const addShift = async (req, res) => {
  // Getting body data
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const userId = req.tokenData.id;
  // Adding shift to database
  try {
    await shiftsService.addShift({
      startTime,
      endTime,
      hourlyWage,
      workplace,
      comments,
      author: userId,
    });
    res.status(200).send("Your shift has been added");
  } catch (error) {
    // TODO: handle error
  }
};

// Update shift by shift id
const updateShift = async (req, res) => {
  // Getting body data
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const { id } = req.params;
  // Updating shift
  try {
    const shiftId = ObjectId.createFromHexString(id);
    await shiftsService.updateShiftById(shiftId, {
      startTime,
      endTime,
      hourlyWage,
      workplace,
      comments,
    });
    res.status(200).send("Your shift has been added");
  } catch (error) {
    // TODO: handle error
  }
};

// This function is used to delete shifts by their _id property
const deleteShift = async (req, res) => {
  const { id } = req.params;
  const userId = req.tokenData.id;
  try {
    const shiftId = ObjectId.createFromHexString(id);
    let result;
    // If the user is not an admin, I ensure that the authorId property of their shift matches the user's _id
    if (req.tokenData.role == "user") {
      result = await shiftsService.deleteShiftById(shiftId, userId);
    } else if (req.tokenData.role === "admin") {
      result = await shiftsService.deleteShiftById(shiftId);
    }
    if (!result || result.length === 0)
      res.status(404).send(`Shift with id: ${id} not found.`);
    else res.status(200).send("Your shift has been deleted.");
  } catch (error) {
    res.status(500).send("An error occurred while deleting the shift.");
  }
};

// This function is used to delete all shifts by userId
const deleteUserShifts = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = ObjectId.createFromHexString(id);
    await shiftsService.deleteUserShifts(userId);
    res.status(200).send("Your shift has been deleted.");
  } catch (error) {}
};

// This function is used to get all users (employees)
const getAllUsers = async (req, res) => {
  try {
    const foundUsers = await User.find({});
    res.status(200).send(foundUsers);
  } catch (error) {
    res.status(400).send("An error has occurred while getting shifts.");
  }
};

// get all users
const getUser = async (req, res) => {
  const { id } = req.params;
  const userId = ObjectId.createFromHexString(id);
  try {
    const userData = await User.findOne({ _id: userId });
    res.status(200).send(userData);
  } catch (error) {
    res.status(400).send("An error has occurred while getting shifts.");
  }
};

export default {
  addShift,
  deleteShift,
  updateShift,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
  getAllUsers,
  getUser,
};
