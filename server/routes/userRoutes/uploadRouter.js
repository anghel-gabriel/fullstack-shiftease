import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import profileService from "../../services/profileService.js";

const uploadRouter = express.Router();

// Construct __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../pictures"));
  },
  filename: function (req, file, cb) {
    // Append the current timestamp to the file name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Ensure the "pictures" folder exists
if (!fs.existsSync(path.join(__dirname, "../../pictures"))) {
  fs.mkdirSync(path.join(__dirname, "../../pictures"));
}

// Endpoint to handle file uploads
uploadRouter.post(
  "/profile-picture",
  upload.single("photo"),
  async (req, res) => {
    console.log("intru in upload");
    const userId = req.tokenData.id;
    if (req.file) {
      const photoURL = `${req.protocol}://${req.get("host")}/pictures/${
        req.file.filename
      }`;
      console.log(photoURL);
      try {
        await profileService.updateProfilePicture(userId, photoURL);
        res
          .status(200)
          .json({ message: "File uploaded successfully", photoURL: photoURL });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  }
);

uploadRouter.delete("/profile-picture", async (req, res) => {
  console.log("Delete request received");
  const { photoURL } = req.body;
  const userId = req.tokenData.id; // Assuming userId is available in tokenData
  console.log("Photo URL:", photoURL);
  console.log("User ID:", userId);

  if (
    !photoURL ||
    photoURL === "http://localhost:8080/pictures/defaultPhoto.png"
  ) {
    console.log("No photoURL provided");
    return res.status(400).json({ message: "photoURL is required" });
  }

  try {
    console.log("123123123123");
    // Update the user's profile picture URL to the default one
    await profileService.removeProfilePicture(userId);
    console.log("Profile picture updated successfully");

    // Extract the filename from the photoURL
    const filename = path.basename(photoURL);
    const filePath = path.join(__dirname, "../../pictures", filename);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        console.log("File deleted successfully");
        res
          .status(200)
          .json({ message: "Profile picture removed successfully" });
      });
    } else {
      console.log("File not found:", filePath);
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.log("Error removing profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default uploadRouter;
