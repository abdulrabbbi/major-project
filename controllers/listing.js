const Listing = require( "../models/listing" ); // Listing model for handling listing data
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: maptoken });
module.exports.index = async (req, res) => {
  let allListings = await Listing.find(); // Fetch all listings
  res.render("listing/index.ejs", { allListings }); // Render index page with listings
};

module.exports.renderForm = (req, res) => {
  res.render("listing/new.ejs"); // Render form for creating a new listing
};

module.exports.uploadListingData = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  const { path: url, filename } = req.file;
  let newlist = req.body.listing;
  let newlisting = new Listing(newlist);
  newlisting.owner = req.user._id;  // store owner data in listing   req.user = currrent user that is login
  newlisting.image = {
    url: url,
    filename: filename,
  };
  newlisting.geometry = response.body.features[0].geometry;
  await newlisting.save(); // Save new listing to database
  req.flash(
    "success",
    "Listing created successfully! Your item is now live !!"
  );
  res.redirect("/listing"); // Redirect to listing index
};

module.exports.showListing = async (req, res) => {
  let id = req.params.id;
  let list = await Listing.findById(id)
    .populate({
      path: "Review",
      populate: {
        path: "auther",
      },
    })
    .populate("owner"); // Fetch listing by ID
  if (!list) {
    req.flash("error", "No results available for your search query");
    res.redirect("/listing");
  }
  res.render("listing/show.ejs", { list }); // Render show page with listing details
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id); // Fetch listing to edit
  if (!list) {
    req.flash("error", "No results available for your search query");
    res.redirect("/listing");
  }
  let orgImage = list.image.url;
  orgImage = orgImage.replace("/upload", "/upload/h_300,w_250,e_blur:50");
  res.render("listing/edit.ejs", { list }); // Render edit form with listing data
};

module.exports.updateListingDetails = async (req, res) => {
  let { id } = req.params;
  let list = req.body.listing;
  await Listing.findById(id);
  let updatelist = await Listing.findByIdAndUpdate(
    id,
    { ...list },
    { new: true }
  ); // Update listing in database
  if (typeof req.file !== "undefined") {
    const { path: url, filename } = req.file;
    updatelist.image = {
      url: url,
      filename: filename,
    };
    await updatelist.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listing/${id}`); // Redirect to listing index
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); // Delete listing by ID
  req.flash("success", "Listing deleted successfully!");

  res.redirect("/listing"); // Redirect to listing index
};
