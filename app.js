const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // Middleware for HTTP method override
const ejsMate = require("ejs-mate"); // Templating engine middleware for enhanced EJS functionality
const expressError = require("./utils/expresserror"); // Custom error handler for Express
const listings = require("./routes/listing");
const Review = require("./routes/review");
const session = require("express-session"); // used to store data of client show on sever side
const flash = require("connect-flash");

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

const sessionOptioin = {
  secret: "yousecretkey",
  resave: false, // forces the session to be saved back to the store even if it hasn't been modified
  saveUninitialized: true, // forces a session that is "uninitialized" to be saved
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptioin));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});
// middleware to handle the routes
app.use("/listing", listings);
app.use("/listing/:id/review", Review);
// Handle 404 errors for undefined routes
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found!!")); // Custom error for undefined routes
});

// Error-handling middleware
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    // Check if headers are already sent
    res.status(err.status || 500).render("error.ejs", { err });
  } else {
    console.error("Headers already sent. Cannot render error page.");
  }
});
// Start server
app.listen(3000, () => {
  console.log("your app is listening on port 3000");
});
