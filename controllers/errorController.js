const AppError = require("./../utils/appError.js");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value},`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError("Invalid token. Please login again...", 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError("Your token has expired. Please login again...", 401);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
      });
    }
    console.error("ERROR ", error);
    return res.status(error.statusCode).render("error", {
      title: "Something went wrong!",
      msg: error.message,
    });
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    err.message = error.message;
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);
    if (req.originalUrl.startsWith("/api")) {
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.mesage,
        });
      }
      console.error("ERROR ", err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong!!!",
      });
    }
    if (err.isOperational) {
      return res.status(error.statusCode).render("error", {
        title: "Something went wrong!",
        msg: error.message,
      });
    }
    console.error("ERROR ", err);
    return res.status(error.statusCode).render("error", {
      title: "Something went wrong!",
      msg: "Please try again later.",
    });
  }
};
