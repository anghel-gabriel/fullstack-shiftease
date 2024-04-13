import express from "express";
import shiftController from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// get single shift by shift id
shiftsRouter.get("/get-shift/:id", shiftController.getShift);
// get all shifts
shiftsRouter.get("/get-shifts", shiftController.getAllShifts);
// add new shift
shiftsRouter.post("/add-shift", shiftController.addShift);
// update shift by shift id
shiftsRouter.put("/update-shift/:id", shiftController.updateShift);
// delete shift by shift id
shiftsRouter.delete("/delete-shift/:id", shiftController.deleteShift);

export default shiftsRouter;
