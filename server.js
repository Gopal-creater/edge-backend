import app from "./app.js";
import mongoose from "mongoose";

//Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});

//Port and Db
const port = process.env.PORT || 8000;
const DB = process.env.DB.replace("<db_password>", process.env.DB_PWD);

//Connection to mongodb
mongoose.connect(DB).then((con) => {
  console.log("Db connection sucessfull!");
});

//Start the server--------
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

//Handle unhandled rejection on promises
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...", err);
  server.close(() => {
    process.exit(1);
  });
});

//Handle SIGTERM
process.on("SIGTERM", (err) => {
  console.log("Sigterm received! Shutting down...");
  server.close(() => {
    // process.exit(1);
    console.log("Process terminated");
  });
});
