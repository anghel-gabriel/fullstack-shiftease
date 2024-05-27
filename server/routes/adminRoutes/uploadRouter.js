import express from "express";
import { upload } from "../userRoutes/uploadRouter.js";
import usersController from "../../controllers/usersController.js";

const uploadRouter = express.Router();

// Upload photo
uploadRouter.post(
  "/profile-picture/:id",
  upload.single("photo"),
  usersController.updateProfilePictureAsAdmin
);

// Delete photo
uploadRouter.delete(
  "/profile-picture",
  usersController.deleteProfilePictureAsAdmin
);

export default uploadRouter;
