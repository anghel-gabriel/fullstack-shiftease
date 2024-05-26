import Shift from "../models/shiftModel.js";
import User from "../models/userModel.js";
import shiftsService from "../services/shiftsService.js";
import { ObjectId } from "mongodb";
import computation from "../utils/computation.js";
import { isWorkplaceValid } from "../utils/validation.js";

// REGULAR USERS

// This function is used by users to get their own shifts
const getUserShifts = async (req, res) => {
  const id = req.tokenData.id;
  try {
    const userId = ObjectId.createFromHexString(id);
    const foundShifts = await shiftsService.getUserShifts(userId);
    res.status(200).send(foundShifts);
  } catch (error) {
    res
      .status(400)
      .send({ message: "An error has occured while getting your shifts." });
  }
};

// This function is used by users to add new shifts
const addShift = async (req, res) => {
  // Getting request data
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const id = req.tokenData.id;
  const userId = ObjectId.createFromHexString(id);
  // Validation
  if (!startTime || !endTime || !computation.isDateBefore(startTime, endTime)) {
    return res.status(400).send({
      message: "The start time must be before the end time.",
    });
  }
  if (!hourlyWage || isNaN(hourlyWage) || hourlyWage <= 0) {
    return res.status(400).send({
      message: "Hourly wage must be greater than 0.",
    });
  }
  if (!workplace || !isWorkplaceValid(workplace)) {
    return res.status(400).send({
      message: "Please select a valid workplace.",
    });
  }
  // Adding shift to database
  try {
    await shiftsService.addShift({
      startTime,
      endTime,
      hourlyWage,
      workplace,
      comments,
      author: id,
      profit: computation.calculateProfit(
        new Date(startTime),
        new Date(endTime),
        hourlyWage
      ),
    });
    const newShifts = await shiftsService.getUserShifts(userId);
    res.status(200).send(newShifts);
  } catch (error) {
    res.status(500).send({
      message:
        "An error occurred while adding the shift. Please try again later.",
    });
  }
};

// This function is used by users to update their own shifts
const updateShift = async (req, res) => {
  // Getting request data
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const { id } = req.params;
  const reqUserId = req.tokenData.id;
  const userId = ObjectId.createFromHexString(reqUserId);
  // Validation
  if (!startTime || !endTime || !computation.isDateBefore(startTime, endTime)) {
    return res.status(400).send({
      message: "The start time must be before the end time.",
    });
  }
  if (!hourlyWage || isNaN(hourlyWage) || hourlyWage <= 0) {
    return res.status(400).send({
      message: "Hourly wage must be greater than 0.",
    });
  }
  if (!workplace || !isWorkplaceValid(workplace)) {
    return res.status(400).send({
      message: "Please select a valid workplace.",
    });
  }
  // Updating shift
  try {
    const shiftId = ObjectId.createFromHexString(id);
    // userId is used to ensure that the author of the shift is the logged-in user
    await shiftsService.updateShiftById(shiftId, reqUserId, {
      startTime,
      endTime,
      hourlyWage,
      workplace,
      comments,
      profit: computation.calculateProfit(
        new Date(startTime),
        new Date(endTime),
        hourlyWage
      ),
    });
    const newShifts = await shiftsService.getUserShifts(userId);
    res.status(200).send(newShifts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while updating the shift." });
  }
};

// This function is used to delete their own shifts by their _id property
const deleteShift = async (req, res) => {
  const { id } = req.params;
  const shiftId = ObjectId.createFromHexString(id);
  const reqUserId = req.tokenData.id;
  const userId = ObjectId.createFromHexString(reqUserId);

  try {
    // userId is used to ensure that the author of the shift is the logged-in user
    await shiftsService.deleteShiftByIdAndAuthor(shiftId, reqUserId);
    const newShifts = await shiftsService.getUserShifts(userId);
    res.status(200).send(newShifts);
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while deleting the shift." });
  }
};

//ADMIN USERS

// This function allows admin to view get all shifts
const getAllShifts = async (req, res) => {
  try {
    /* 
    The "populate" method from Mongoose is used to retrieve the firstName and lastName 
    fields from the user document referenced by the "author" property in each shift 
    object. This ensures that each shift includes the author's full name. 
    */
    const populatedShifts = await shiftsService.getAllShifts();
    res.status(200).send({
      message: "Shifts fetched successfully",
      data: populatedShifts,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "An error has occurred while getting shifts." });
  }
};

// This function is used by users to update their own shifts
const updateShiftAsAdmin = async (req, res) => {
  // Getting request data
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const { id } = req.params;
  // Validation
  if (!startTime || !endTime || !computation.isDateBefore(startTime, endTime)) {
    return res.status(400).send({
      message: "The start time must be before the end time.",
    });
  }
  if (!hourlyWage || isNaN(hourlyWage) || hourlyWage <= 0) {
    return res.status(400).send({
      message: "Hourly wage must be greater than 0.",
    });
  }
  if (!workplace || !isWorkplaceValid(workplace)) {
    return res.status(400).send({
      message: "Please select a valid workplace.",
    });
  }
  // Updating shift
  try {
    const shiftId = ObjectId.createFromHexString(id);
    await shiftsService.updateShiftByIdAsAdmin(shiftId, {
      startTime,
      endTime,
      hourlyWage,
      workplace,
      comments,
      profit: computation.calculateProfit(
        new Date(startTime),
        new Date(endTime),
        hourlyWage
      ),
    });
    const populatedShifts = await shiftsService.getAllShifts();
    res
      .status(200)
      .send({ message: "Shift updated successfully", data: populatedShifts });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while updating the shift." });
  }
};

// This function is used by admins to delete any shift by shiftId
const deleteShiftAsAdmin = async (req, res) => {
  const { id } = req.params;
  const shiftId = ObjectId.createFromHexString(id);

  try {
    await shiftsService.deleteShiftAsAdmin(shiftId);
    const newShifts = await shiftsService.getAllShifts();
    res
      .status(200)
      .send({ message: "Shift deleted successfully", data: newShifts });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while deleting the shift." });
  }
};

// This function is used to delete all shifts by userId
const deleteUserShifts = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = ObjectId.createFromHexString(id);
    await shiftsService.deleteUserShifts(userId);
    res.status(200).send({ message: "Your shift has been deleted." });
  } catch (error) {
    res.status(500).send({
      message:
        "An error occurred while deleting the shifts. Please try again later.",
    });
  }
};

export default {
  addShift,
  deleteShift,
  updateShift,
  getAllShifts,
  getUserShifts,
  deleteUserShifts,
  deleteShiftAsAdmin,
  updateShiftAsAdmin,
};

// TODO: check for ids bla bla
