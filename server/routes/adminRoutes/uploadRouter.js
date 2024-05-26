import express from "express";
import path from "path";
import fs from "fs";
import profileService from "../../services/profileService.js";
import { upload } from "../userRoutes/uploadRouter.js";
import { ObjectId } from "mongodb";
import profileController from "../../controllers/profileController.js";

const uploadRouter = express.Router();

// Upload photo
uploadRouter.post(
  "/profile-picture/:id",
  upload.single("photo"),
  profileController.updateProfilePictureAsAdmin
);

// Delete photo
uploadRouter.delete(
  "/profile-picture",
  profileController.deleteProfilePictureAsAdmin
);

export default uploadRouter;
