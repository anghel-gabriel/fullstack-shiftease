import express from "express";
import usersController from "../../controllers/usersController.js";

const profileRouter = express.Router();

// This endpoint is used by users to change their own email address
profileRouter.put("/change-email", usersController.changeEmailAddress);

// This endpoint is used by users to change their own password
profileRouter.put("/change-password", usersController.changePassword);

// This endpoint is used by users to update their own profile data
profileRouter.put("/update-profile", usersController.updateProfile);

export default profileRouter;
