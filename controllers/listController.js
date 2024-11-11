import List from "../models/listModal.js";
import factory from "./handlerFactory.js";

// Define list class
class ListController {
  getAllList = () => factory.getAll(List);

  getList = () => factory.getOne(List);

  createList = () => factory.createOne(List);

  updateList = () => factory.updateOne(List);

  deleteList = () => factory.deleteOne(List);
}

// Exporting an instance of the UserController class
const listController = new ListController();
export default listController;
