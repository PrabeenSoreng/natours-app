const AppError = require("./../utils/appError.js");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value},`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.mesage,
      stack: error.stack
    });
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.mesage
      });
    } else {
      console.error("ERROR ", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!!!"
      });
    }
  }
};
