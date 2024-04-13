import Shift from "../models/shiftModel.js";

export const postAddShift = async (req, res, next) => {
  const { startTime, endTime, hourlyWage, workplace, comments } = req.body;

  const shift = new Shift({
    startTime: startTime,
    endTime: endTime,
    hourlyWage: hourlyWage,
    workplace: workplace,
    comments: comments,
  });

  try {
    await shift.save();
    console.log("Your shift has been added.");
  } catch (error) {
    console.log("An error has occured while adding your shift.", error);
  }
};
