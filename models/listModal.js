import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ListItem from "./listItemModal.js";

//Defining list schema
const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    description: { type: String },
  },
  { timestamps: true }
);

//Using mongoosePaginate library for pagination
listSchema.plugin(mongoosePaginate);

// Middleware to delete all list items when a list is deleted
listSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getFilter());
  if (docToDelete) {
    await ListItem.deleteMany({ listId: docToDelete._id });
  }
  next();
});

const List = mongoose.model("List", listSchema);
export default List;
