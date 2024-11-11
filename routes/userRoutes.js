import express from "express";
import authController from "../controllers/authController.js";

const userRouter = express.Router();

//Routes for authentication
userRouter.route("/signin").post(authController.login);
userRouter.route("/me").get(authController.protect, authController.getMe);

export default userRouter;
