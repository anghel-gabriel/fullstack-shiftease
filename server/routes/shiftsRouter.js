import express from "express";
import shiftController from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// Get all shifts
shiftsRouter.get("/get-shifts", shiftController.getAllShifts);
// Get shifts by user id
shiftsRouter.get("/get-user-shifts", shiftController.getUserShifts);
// Add new shift
shiftsRouter.post("/add-shift", shiftController.addShift);
// Update shift by shift id
shiftsRouter.put("/update-shift/:id", shiftController.updateShift);
// Delete shift by shift id
shiftsRouter.delete("/delete-shift/:id", shiftController.deleteShift);

export default shiftsRouter;
