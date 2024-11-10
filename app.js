const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // Middleware for HTTP method override
const ejsMate = require("ejs-mate"); // Templating engine middleware for enhanced EJS functionality
const expressError = require("./utils/expresserror"); // Custom error handler for Express
const listings = require("./routes/listing");
const Review = require("./routes/review");

// MongoDB connection URL
const mongoUrl = "mongodb://127.0.0.1:27017/Wandurlust";

async function main() {
  await mongoose.connect(mongoUrl); // Connect to MongoDB
}

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

// Middleware and configuration
app.engine("ejs", ejsMate); // Use ejsMate as the EJS templating engine
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("views", path.join(__dirname, "views")); // Define views directory
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files
app.use(methodOverride("_method")); // Enable method override for PUT and DELETE requests

app.use("/listing", listings);
app.use("/listing/:id/review", Review);

// Handle 404 errors for undefined routes
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found!!")); // Custom error for undefined routes
});

// Error-handling middleware
app.use((err, req, res, next) => {
  res.render("error.ejs", { err }); // Render error page with error details
  next();
});

// Start server
app.listen(3000, () => {
  console.log("your app is listening on port 3000");
});
