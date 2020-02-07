const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const sendEmail = require("../utils/email.js");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!!!", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please login to get access...", 401)
    );

  // 2. Token verification
  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if user still exists
  const currentUser = await User.findById(decodedPayload.id);
  if (!currentUser)
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );

  // 4. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decodedPayload.iat))
    return next(
      new AppError("User recently changed password! Please login again...", 401)
    );

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action...",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with the given email address...", 404)
    );
  }

  // Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}. \nIf you didn't forget your password, please ignore this email!!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token, only valid for few minutes...",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token send to the mail"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!!!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
