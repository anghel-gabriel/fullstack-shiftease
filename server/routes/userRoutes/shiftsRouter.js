import express from "express";
import shiftsController from "../../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// This endpoint is used to get the logged user's shifts
shiftsRouter.get("/get-user-shifts", shiftsController.getUserShifts);

// This endpoint is used by users to add a new shift
shiftsRouter.post("/add-shift", shiftsController.addShift);

// This endpoint is used by users to update a shift
shiftsRouter.put("/update-shift/:id", shiftsController.updateShift);

// This endpoint is used by users to delete a shift
shiftsRouter.delete("/delete-shift/:id", shiftsController.deleteShift);

export default shiftsRouter;
