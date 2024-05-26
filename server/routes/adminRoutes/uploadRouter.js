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
uploadRouter.delete("/profile-picture", async (req, res) => {
  const { photoURL } = req.body;
  const userId = req.tokenData.id; // Assuming userId is available in tokenData

  if (
    !photoURL ||
    photoURL === "http://localhost:8080/pictures/defaultPhoto.png"
  ) {
    return res.status(400).json({ message: "photoURL is required" });
  }

  try {
    // Update the user's profile picture URL to the default one
    await profileService.removeProfilePicture(userId);

    // Extract the filename from the photoURL
    const filename = path.basename(photoURL);
    const filePath = path.join(__dirname, "../../pictures", filename);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default uploadRouter;
