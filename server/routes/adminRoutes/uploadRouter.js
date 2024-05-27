import express from "express";
import { upload } from "../userRoutes/uploadRouter.js";
import usersController from "../../controllers/usersController.js";

const uploadRouter = express.Router();

// This endpoint is used by admins to update any user's profile photo
uploadRouter.post(
  "/profile-picture/:id",
  upload.single("photo"),
  usersController.updateProfilePictureAsAdmin
);

// This endpoint is used by admins to delete any user's profile photo
uploadRouter.delete(
  "/profile-picture",
  usersController.deleteProfilePictureAsAdmin
);

export default uploadRouter;
