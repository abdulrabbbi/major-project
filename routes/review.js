const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync"); // Utility for handling async errors with try-catch
const { ReviewSchema } = require("../schema"); // Validation schemas for listings and reviews
const Review = require("../models/review"); // Review model for handling review data

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
    res.redirect(`/listing/${listing.id}`); // Send confirmation message
  })
);
//delete the review from listing
router.delete(
  "/listing/:id/review/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { Review: reviewId } });
    await Listing.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
