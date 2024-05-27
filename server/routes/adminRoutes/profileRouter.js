import express from "express";
import usersController from "../../controllers/usersController.js";

const profileRouter = express.Router();

profileRouter.get("/get-all-users", usersController.getAllUsers);
profileRouter.get("/get-user/:id", usersController.getUser);
profileRouter.put("/update-profile/:id", usersController.updateProfileAsAdmin);

export default profileRouter;
