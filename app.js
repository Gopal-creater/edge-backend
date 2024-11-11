import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import listRouter from "./routes/listRoutes.js";
import listItemRouter from "./routes/listItemRoutes.js";
import cors from "cors";

// Loading the env file
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./devConfig.env" });
} else {
  dotenv.config({ path: "./prodConfig.env" });
}

//Initialize the application
const app = express();

//Implement cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // This allows sending credentials
  })
);

/* parses the incoming request body containing JSON data This allows you to easily work with the JSON data */
app.use(express.json({ limit: "10kb" }));

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes----------
app.get("/", (req, res) => {
  res.send("Interview backend services By Gopal Gautam!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/lists", listRouter);
app.use("/api/v1/list-items", listItemRouter);

//Global Error Handler
app.use(globalErrorHandler);

//Handling unhandled request
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `can't find ${req.originalUrl} on this server`,
  });
  next();
});

export default app;
