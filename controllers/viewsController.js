const Tour = require("../models/tourModel.js");
const catchAsync = require("../utils/catchAsync.js");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();
  // 2. Build template
  // 3. Render that template using tour data from step 1
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = (req, res, next) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker Tour",
  });
};
