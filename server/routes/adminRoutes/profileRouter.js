import express from "express";
import profileController from "../../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/get-all-users", profileController.getAllUsers);
profileRouter.get("/get-user/:id", profileController.getUser);

export default profileRouter;
