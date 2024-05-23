import express from "express";
import profileController from "../../controllers/profileController.js";

const profileRouter = express.Router();

// This endpoint is used by users to change their own email address
profileRouter.put("/change-email", profileController.changeEmailAddress);

// This endpoint is used by users to change their own password
profileRouter.put("/change-password", profileController.changePassword);

// This endpoint is used by users to update their own profile data
profileRouter.put("/update-profile", profileController.updateProfile);

export default profileRouter;
