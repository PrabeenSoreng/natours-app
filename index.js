const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Hello from the server side..." });
});

app.post("/", (req, res, next) => {
  res.send("You can post to this end point");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
