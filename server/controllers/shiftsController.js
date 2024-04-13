import Shift from "../models/shiftModel.js";
import shiftsService from "../services/shiftsService.js";
import { ObjectId } from "mongodb";

// get single shift by shift id
const getShift = async (req, res, next) => {
  const { id } = req.params;

  try {
    const shiftId = ObjectId.createFromHexString(id);
    const foundShift = await shiftsService.getShiftById(shiftId);
    res.status(200).send(foundShift);
  } catch (error) {
    res.status(400).send("Shift was not found.");
  }
};

// get all shifts
const getAllShifts = async (req, res, next) => {
  try {
    const foundShifts = await shiftsService.getAllShifts();
    res.status(200).send(foundShifts);
  } catch (error) {
    res.status(400).send("An error has occured while getting shifts.");
  }
};

// add new shift
const addShift = async (req, res, next) => {
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  // getting body data
  const shift = new Shift({
    startTime: startTime,
    endTime: endTime,
    hourlyWage: hourlyWage,
    workplace: workplace,
    comments: comments,
  });
  // adding shift to database
  try {
    await shiftsService.addShift(shift);
    res.status(200).send("Your shift has been added");
  } catch (error) {
    console.log("An error has occured while adding your shift.", error);
  }
};

// update shift by shift id
const updateShift = async (req, res, next) => {
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;
  const { id } = req.params;
  // getting body data
  const shift = new Shift({
    startTime: startTime,
    endTime: endTime,
    hourlyWage: hourlyWage,
    workplace: workplace,
    comments: comments,
  });
  // adding shift to database
  try {
    const shiftId = ObjectId.createFromHexString(id);
    await shiftsService.updateShiftById(shiftId, req.body);
    res.status(200).send("Your shift has been added");
  } catch (error) {
    console.log("An error has occured while adding your shift.", error);
  }
};

// delete shift by shift id
const deleteShift = async (req, res, next) => {
  const { id } = req.params;
  // adding shift to database
  try {
    const shiftId = ObjectId.createFromHexString(id);
    console.log(shiftId);
    const result = await shiftsService.deleteShift(shiftId);
    if (!result || result.length === 0)
      res.status(404).send(`Shift with id: ${id} not found.`);
    else res.status(200).send("Your shift has been deleted.");
  } catch (error) {
    console.log("An error has occured while deleting your shift.", error);
  }
};

export default {
  addShift,
  deleteShift,
  getShift,
  updateShift,
  getAllShifts,
};
