const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required."]
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, "Email is required."],
    validate: [validator.isEmail, "Please provide a valid email."]
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: 8
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is requred."]
  }
});

module.exports = mongoose.Model("User", userSchema);
