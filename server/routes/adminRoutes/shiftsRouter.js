import express from "express";
import shiftsController from "../../controllers/shiftsController.js";

const shiftsRouter = express.Router();

// This endpoint is used by admins to get all shifts
shiftsRouter.get("/get-all-shifts", shiftsController.getAllShifts);

// This endpoint is used by admins to delete every shift of an user
shiftsRouter.delete(
  "/delete-user-shifts/:id",
  shiftsController.deleteUserShifts
);

// This endpoint is used by admins to delete any shift
shiftsRouter.delete("/delete-shift/:id", shiftsController.deleteShiftAsAdmin);

// This endpoint is used by admins to update any shift
shiftsRouter.put("/update-shift/:id", shiftsController.updateShiftAsAdmin);

export default shiftsRouter;
