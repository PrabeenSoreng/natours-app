const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!!!`
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
