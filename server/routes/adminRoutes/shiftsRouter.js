import express from "express";
import shiftsController from "../../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// Get all shifts
shiftsRouter.get("/get-all-shifts", shiftsController.getAllShifts);
// Update shift by shift id
shiftsRouter.put("/update-shift/:id", shiftsController.updateShift);
// Delete shift by shift id
shiftsRouter.delete("/delete-shift/:id", shiftsController.deleteShift);

export default shiftsRouter;
