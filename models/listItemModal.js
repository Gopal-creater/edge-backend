import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//Define listItem Schema
const listItemSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
  },
  { timestamps: true }
);

//Using mongoosePaginate library for pagination
listItemSchema.plugin(mongoosePaginate);

// Add an index to improve query performance
listItemSchema.index({ listId: 1 });

const ListItem = mongoose.model("ListItem", listItemSchema);
export default ListItem;
