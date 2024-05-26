import express from "express";
import profileController from "../../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get("/get-all-users", profileController.getAllUsers);
profileRouter.get("/get-user/:id", profileController.getUser);
profileRouter.put(
  "/update-profile/:id",
  profileController.updateProfileAsAdmin
);

export default profileRouter;
