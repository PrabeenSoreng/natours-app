const express = require("express");
const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getOverview);

router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);

router.get("/signup", viewsController.getSignupForm);

router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);

router.get("/me", authController.protect, viewsController.getAccount);

module.exports = router;
