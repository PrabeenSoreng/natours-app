const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION!!! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: "./config.env"
});

const app = require("./index.js");
// console.log(app.get("env"));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connection successful..."));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION!!! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
