const User = require("../models/userModel.js");
const Booking = require("../models/bookingModel.js");
const Tour = require("../models/tourModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build template
  // 3. Render template using tour data from step 1
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is not tour with that name.", 404));
  }
  // 2. Build template
  // 3. Render template using data from step 1
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.getSignupForm = (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
};

exports.getLoginForm = (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2. Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});
