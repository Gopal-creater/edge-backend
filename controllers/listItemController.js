import ListItem from "../models/listItemModal.js";
import factory from "./handlerFactory.js";

// Define list class
class ListItemController {
  getAllListItem = () => factory.getAll(ListItem);

  getListItem = () => factory.getOne(ListItem);

  createListItem = () => factory.createOne(ListItem);

  updateListItem = () => factory.updateOne(ListItem);

  deleteListItem = () => factory.deleteOne(ListItem);
}

// Exporting an instance of the UserController class
const listItemController = new ListItemController();
export default listItemController;
