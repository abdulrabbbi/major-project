const Review = require("../models/review"); // Review model for handling review data
const Listing = require("../models/listing"); // Listing model for handling listing data

// Add a New Review
module.exports.addReview = async (req, res) => {
  let { id } = req.params; // Extract listing ID from request parameters
  let listing = await Listing.findById(id); // Fetch the listing to add a review to

  let review = new Review(req.body.review); // Create a new review with form data
  review.auther = req.user._id; // Set the author of the review to the logged-in user

  listing.Review.push(review); // Add the review to the listing's reviews array

  await review.save(); // Save the review to the database
  await listing.save(); // Save the updated listing to the database

  req.flash("success", "Thank you! Your review has been added successfully."); // Flash success message
  res.redirect(`/listing/${listing.id}`); // Redirect to the listing's detail page
};

// Delete an Existing Review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params; // Extract listing ID and review ID from request parameters

  await Listing.findByIdAndUpdate(id, { $pull: { Review: reviewId } }); // Remove the review reference from the listing
  await Review.findByIdAndDelete(reviewId); // Delete the review from the database

  req.flash("success", "The review has been successfully deleted."); // Flash success message
  res.redirect(`/listing/${id}`); // Redirect to the listing's detail page
};
