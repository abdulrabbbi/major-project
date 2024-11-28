const Listing = require("../models/listing"); // Listing model for handling listing data
const Review = require("../models/review"); // Listing model for handling listing data
const expressError = require("../utils/expresserror"); // Custom error handler for Express
const { listingSchema, ReviewSchema } = require("../schema"); // Validation schemas for listings and reviews

module.exports.isloggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the original URL to the session
    req.flash(
      "error",
      "Access denied. Please log in to proceed"
    );
    return res.redirect("/login");
  }
  next(); // Proceed to the next middleware if authenticated
};

// to redirect the origional page affter login
module.exports.redirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectURL = req.session.redirectUrl;
  }
  next();
};

// to check the user is athrerized for crud operations
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to perform this operation.");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

// Validate listing data from backend
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // Validate with listing schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, errMsg)); // Throw custom error if validation fails
  }
  next(); // Proceed if validation passes
};

// Validate review data from backend
module.exports.validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body); // Validate with review schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, errMsg)); // Throw custom error if validation fails
  }
  next(); // Proceed if validation passes
};

// to check the reivew auther
module.exports.isReviewAuther = async (req, res, next) => {
  let { id , reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if (!review.auther.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to perform this operation.");
    return res.redirect(`/listing/${id}`);
  }
  next();
};