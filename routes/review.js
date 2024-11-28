const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync"); // Utility for handling async errors with try-catch
const Reviewcontroller = require("../controllers/review");
const {
  validateReview,
  isloggin,
  isReviewAuther,
} = require("../middleware/islogin");
// Add a review to a listing
router.post(
  "/",
  validateReview,
  isloggin,
  wrapAsync(Reviewcontroller.addReview)
);

//delete the review from listing
router.delete(
  "/:reviewId",
  isloggin,
  isReviewAuther,
  wrapAsync(Reviewcontroller.deleteReview)
);

module.exports = router;
