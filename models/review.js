const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true, // Optional: Ensures a comment is provided
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Optional: Ensures a rating is provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
