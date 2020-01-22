const mongoose = require("mongoose");
const dotenv = require("dotenv");
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
  .then(() => console.log("DB connection successful..."))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
