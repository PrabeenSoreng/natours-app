const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    minLength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is requred."],
    validate: {
      // This only works on save and create.
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same!"
    }
  }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
