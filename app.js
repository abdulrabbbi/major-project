const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync"); //  try and catch to async error
const expressError = require("./utils/expresserror"); //  to handle the express error
const wrapasync = require("./utils/wrapasync"); // to handle the async function
const { listingSchema } = require("./schema");
const Review = require("./models/review");
const mongoUrl = "mongodb://127.0.0.1:27017/Wandurlust";
async function main() {
  await mongoose.connect(mongoUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));
// middle ware
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

//validte listing from backend side
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new expressError(400, errMsg));
  }
  next();
};
//home route
app.get("/", (req, res) => {
  res.send("you home route");
});
//index route
app.get(
  "/listing",

  wrapasync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listing/index.ejs", { allListings });
  })
);
//create new listing
app.get(
  "/listing/new",
  wrapasync((req, res) => {
    res.render("listing/new.ejs");
  })
);
// save the listing details
app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res) => {
    let newlist = req.body.listing;
    let newlisting = new Listing(newlist);
    await newlisting.save();
    res.redirect("/listing");
  })
);
// show route
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let list = await Listing.findById(id);
    res.render("listing/show.ejs", { list });
  })
);
// edit route
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listing/edit.ejs", { list });
  })
);
//render the update
app.put(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...list }, { new: true });
    res.redirect("/listing");
  })
);
//delete the listing
app.delete(
  "/listing/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);
//to handle the review
app.post(
  "/listing/:id/review",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    listing.Review.push(review);
    await review.save();
    let finalresult = await listing.save();
    console.log("review saeved");
    console.log(finalresult); 
    res.send("saved");
  })
);
//to handle error
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found!!"));
});
app.use((err, req, res, next) => {
  res.render("error.ejs", { err });
  next();
});
app.listen(3000, () => {
  console.log("your app is listing for 3000");
});
