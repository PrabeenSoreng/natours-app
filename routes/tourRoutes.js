const express = require("express");
const tourController = require("../controllers/tourController.js");

const router = express.Router();

const middleware = (req, res, next) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(404).json({
      message: "fail"
    });
  }
  next();
};

router.param("id", tourController.checkID);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(middleware, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
