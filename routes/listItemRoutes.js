import express from "express";
import listItemController from "../controllers/listItemController.js";
import authController from "../controllers/authController.js";

const listItemRouter = express.Router();

listItemRouter
  .route("/")
  .get(authController.protect, listItemController.getAllListItem())
  .post(authController.protect, listItemController.createListItem());

listItemRouter
  .route("/:id")
  .get(authController.protect, listItemController.getListItem())
  .patch(authController.protect, listItemController.updateListItem())
  .delete(authController.protect, listItemController.deleteListItem());

export default listItemRouter;
