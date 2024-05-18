import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import profileService from "../services/profileService.js";

const uploadRouter = express.Router();

// Construct __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../pictures"));
  },
  filename: function (req, file, cb) {
    // Append the current timestamp to the file name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Ensure the "pictures" folder exists
if (!fs.existsSync(path.join(__dirname, "../pictures"))) {
  fs.mkdirSync(path.join(__dirname, "../pictures"));
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

// Serve the pictures directory statically
uploadRouter.use(
  "/pictures",
  express.static(path.join(__dirname, "../pictures"))
);

export default uploadRouter;
