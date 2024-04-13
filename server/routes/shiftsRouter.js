import express from "express";
import shiftController from "../controllers/shiftsController.js";
import shiftsService from "../services/shiftsService.js";

const shiftsRouter = express.Router();

shiftsRouter.get("/get-shift", shiftController.getShift);
shiftsRouter.post("/add-shift", shiftController.addShift);
shiftsRouter.put("/edit-shift", shiftController.editShift);
shiftsRouter.delete("/delete-shift", shiftController.deleteShift);

export default shiftsRouter;
