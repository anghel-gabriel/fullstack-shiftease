import express from "express";
import shiftsController from "../../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// Get all shifts
shiftsRouter.get("/get-all-shifts", shiftsController.getAllShifts);

// Delete all shifts of an user
shiftsRouter.delete(
  "/delete-user-shifts/:id",
  shiftsController.deleteUserShifts
);

// Delete shift by shift id
shiftsRouter.delete("/delete-shift/:id", shiftsController.deleteShiftAsAdmin);

export default shiftsRouter;
