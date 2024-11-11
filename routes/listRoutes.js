import express from "express";
import listController from "../controllers/listController.js";
import authController from "../controllers/authController.js";

const listRouter = express.Router();

listRouter
  .route("/")
  .get(authController.protect, listController.getAllList())
  .post(authController.protect, listController.createList());

listRouter
  .route("/:id")
  .get(authController.protect, listController.getList())
  .patch(authController.protect, listController.updateList())
  .delete(authController.protect, listController.deleteList());

export default listRouter;
