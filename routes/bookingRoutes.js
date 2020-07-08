const express = require("express");
const authController = require("../controllers/authController.js");
const bookingController = require("../controllers/bookingController.js");

const router = express.Router();

router.get(
  "/checkout-session/:tourId",
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
