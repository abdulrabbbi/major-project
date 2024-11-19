const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync"); // Utility for handling async errors with try-catch
const expressError = require("../utils/expresserror"); // Custom error handler for Express
const { ReviewSchema } = require("../schema"); // Validation schemas for listings and reviews
const Review = require("../models/review"); // Review model for handling review data
const Listing = require("../models/listing"); // Listing model for handling listing data

// Validate review data from backend
const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body); // Validate with review schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, errMsg)); // Throw custom error if validation fails
  }
  next(); // Proceed if validation passes
};

// Add a review to a listing
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); // Fetch listing to review
    let review = new Review(req.body.review); // Create new review
    listing.Review.push(review); // Add review to listing
    await review.save(); // Save review to database
    await listing.save(); // Save updated listing
    req.flash(
      "success",
      "Thank you! Your review has been added successfully"
    );
    res.redirect(`/listing/${listing.id}`); // Send confirmation message
  })
);

//delete the review from listing
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { Review: reviewId } });
    await Listing.findByIdAndDelete(reviewId);
    req.flash(
      "success",
      "The review has been successfully deleted"
    );
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
