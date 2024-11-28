if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync"); // Utility for handling async errors
const { isloggin, isOwner, validateListing } = require("../middleware/islogin");
const Listingcontroller = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
// Routes for Listings

// 1. Index route for all listings
router
  .route("/")
  .get(wrapAsync(Listingcontroller.index)) // Fetch all listings
  .post(
    isloggin, // Ensure user is logged in
    upload.single("listing[image]"),
    validateListing, // Validate listing data
    wrapAsync(Listingcontroller.uploadListingData) // Save new listing
  );

// 2. Form to create a new listing
router.get("/new", isloggin, wrapAsync(Listingcontroller.renderForm));

// 3. Show a single listing
router.get("/:id", wrapAsync(Listingcontroller.showListing));

// 4. Edit and Update a listing
router
  .route("/:id/edit")
  .get(isloggin, isOwner, wrapAsync(Listingcontroller.renderEditForm)) // Edit form
  .put(
    isloggin, // Ensure user is logged in
    isOwner, // Ensure user owns the listing
    upload.single("listing[image]"),
    validateListing, // Validate updated listing data
    wrapAsync(Listingcontroller.updateListingDetails) // Update listing
  );

// 5. Delete a listing
router.delete(
  "/:id/delete",
  isloggin, // Ensure user is logged in
  isOwner, // Ensure user owns the listing
  wrapAsync(Listingcontroller.deleteListing) // Delete listing
);

module.exports = router;
