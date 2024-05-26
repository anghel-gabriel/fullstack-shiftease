import express from "express";
import profileController from "../../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/get-all-users", profileController.getAllUsers);

export default profileRouter;
