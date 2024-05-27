import express from "express";
import usersController from "../../controllers/usersController.js";

const profileRouter = express.Router();

// This endpoint is used by admins to get all users
profileRouter.get("/get-all-users", usersController.getAllUsers);

// This endpoint is used by admins to get any user's data
profileRouter.get("/get-user/:id", usersController.getUser);

// This endpoint is used by admins to update any user's profile
profileRouter.put("/update-profile/:id", usersController.updateProfileAsAdmin);

export default profileRouter;
