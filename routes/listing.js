const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema"); // Validation schemas for listings and reviews
const Listing = require("../models/listing"); // Listing model for handling listing data
const wrapAsync = require("../utils/wrapasync"); // Utility for handling async errors with try-catch
const expressError = require("../utils/expresserror"); // Custom error handler for Express

// Validate listing data from backend
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // Validate with listing schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, errMsg)); // Throw custom error if validation fails
  }
  next(); // Proceed if validation passes
};

// Index route for all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find(); // Fetch all listings
    res.render("listing/index.ejs", { allListings }); // Render index page with listings
  })
);

// Create new listing form route
router.get(
  "/new",
  wrapAsync((req, res) => {
    res.render("listing/new.ejs"); // Render form for creating a new listing
  })
);

// Save new listing to database
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let newlist = req.body.listing;
    let newlisting = new Listing(newlist);
    await newlisting.save(); // Save new listing to database
    req.flash("success", "Listing created successfully! Your item is now live");
    res.redirect("/listing"); // Redirect to listing index
  })
);

// Show route for a single listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let list = await Listing.findById(id).populate("Review"); // Fetch listing by ID
    res.render("listing/show.ejs", { list }); // Render show page with listing details
  })
);

// Edit form route for a listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id); // Fetch listing to edit
    res.render("listing/edit.ejs", { list }); // Render edit form with listing data
  })
);

// Update listing details
router.put(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...list }, { new: true }); // Update listing in database
    res.redirect("/listing"); // Redirect to listing index
  })
);

// Delete a listing
router.delete(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id); // Delete listing by ID
    res.redirect("/listing"); // Redirect to listing index
  })
);
module.exports = router;
