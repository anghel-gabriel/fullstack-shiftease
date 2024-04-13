import { overwriteMiddlewareResult } from "mongoose";
import Shift from "../models/shiftModel.js";
import shiftsService from "../services/shiftsService.js";
import { ObjectId } from "mongodb";

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
    await shift.save();
    res.status(200).send("Your shift has been added");
  } catch (error) {
    console.log("An error has occured while adding your shift.", error);
  }
};

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

const getShift = async (req, res, next) => {};

export default {
  addShift,
  deleteShift,
  getShift,
  updateShift,
};
