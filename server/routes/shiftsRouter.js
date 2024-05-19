import express from "express";
import shiftsController from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// Get all shifts
shiftsRouter.get("/get-shifts", shiftsController.getAllShifts);
// Get shifts by user id
shiftsRouter.get("/get-user-shifts", shiftsController.getUserShifts);
// Add new shift
shiftsRouter.post("/add-shift", shiftsController.addShift);
// Update shift by shift id
shiftsRouter.put("/update-shift/:id", shiftsController.updateShift);
// Delete shift by shift id
shiftsRouter.delete("/delete-shift/:id", shiftsController.deleteShift);

export default shiftsRouter;
