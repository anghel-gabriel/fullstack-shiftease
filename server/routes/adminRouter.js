import express from "express";
import shiftsController from "../controllers/shiftsController.js";

const adminRouter = express.Router();

adminRouter.delete(
  "/delete-user-shifts/:id",
  shiftsController.deleteUserShifts
);

adminRouter.get("/get-all-users", shiftsController.getAllUsers);

adminRouter.get("/get-user/:id", shiftsController.getUser);

export default adminRouter;
