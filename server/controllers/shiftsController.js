import Shift from "../models/shiftModel.js";

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
  const { id } = req.body;
  // adding shift to database
  try {
    await Shift.deleteOne({ _id: id });
    res.status(200).send("Your shift has been deleted.");
  } catch (error) {
    console.log("An error has occured while adding your shift.", error);
  }
};

const getShift = async (req, res, next) => {};

const editShift = async (req, res, next) => {};

export default {
  addShift,
  deleteShift,
  getShift,
  editShift,
};
