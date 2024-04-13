import express from "express";
import shiftController from "../controllers/shiftsController.js";

const shiftsRouter = express.Router();

shiftsRouter.get("/get-shift", shiftController.getShift);
shiftsRouter.post("/add-shift", shiftController.addShift);
shiftsRouter.put("/update-shift/:id", shiftController.updateShift);
shiftsRouter.delete("/delete-shift", shiftController.deleteShift);

export default shiftsRouter;
