import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import usersController from "../../controllers/usersController.js";

const uploadRouter = express.Router();

// Construct __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

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
export const upload = multer({ storage: storage });

// This endpoint is used by users to update their profile photo
uploadRouter.post(
  "/profile-picture",
  upload.single("photo"),
  usersController.updateProfilePicture
);

// This endpoint is used by users to delete their profile photo
uploadRouter.delete("/profile-picture", usersController.deleteProfilePicture);

export default uploadRouter;
