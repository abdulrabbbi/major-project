const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // Middleware for HTTP method override
const ejsMate = require("ejs-mate"); // Templating engine middleware for enhanced EJS functionality
const expressError = require("./utils/expresserror"); // Custom error handler for Express
const listingrouter = require("./routes/listing");
const ReviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const MongoStore = require("connect-mongo"); // use for session storage in mongodb
const session = require("express-session"); // used to store data of client show on sever side
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const favicon = require("serve-favicon");

const uri = process.env.ATLASDB_URL;

// MongoDB connection URL
// const mongoUrl = "mongodb://127.0.0.1:27017/Wandurlust";

async function main() {
  await mongoose.connect(uri); // Connect to MongoDB
}

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

// Middleware and configuration
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.engine("ejs", ejsMate); // Use ejsMate as the EJS templating engine
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data from forms
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("views", path.join(__dirname, "views")); // Define views directory
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files
app.use(express.static("public")); // Ensure this serves your favicon
app.use(methodOverride("_method")); // Enable method override for PUT and DELETE requests

const store = MongoStore.create({
  mongoUrl: uri, // Ensure `uri` is defined and contains a valid MongoDB connection string
  crypto: {
    secret: process.env.SESSION_SECRET, // Replace with a strong secret or use an environment variable
  },
  touchAfter: 24 * 3600, // Reduce write operations by updating session data only once every 24 hours
});

// Handle errors in the session store
store.on("error", (err) => {
  console.log("Error in MongoDB session store:", err);
});


const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "fallbackSecretKey", // Use a secure secret key
  resave: false, // Prevent unnecessary session resaves
  saveUninitialized: true, // Save uninitialized sessions
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Corrected `expires` format
    maxAge: 7 * 24 * 60 * 60 * 1000, // Set the cookie's lifetime
    httpOnly: true, // Enhance security by making the cookie inaccessible via JavaScript
  },
};

// for store the user information in session
app.use(session(sessionOptions));
app.use(flash());

// using passport for authenticate

// Initialize Passport middleware for handling authentication
app.use(passport.initialize());

// Enable session-based authentication for persistent login sessions
app.use(passport.session());

// Configure Passport to use the local strategy for authentication
// The `User.authenticate()` method is provided by `passport-local-mongoose`
// It simplifies username and password validation
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // sterializer means store the user information in session
passport.deserializeUser(User.deserializeUser()); // Unsteriazer uers means remove the information for session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// middleware to handle the routes
app.use("/listing", listingrouter);
app.use("/listing/:id/review", ReviewRouter);
app.use("/", userRouter);

// Handle 404 errors for undefined routes
app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found!!")); // Custom error for undefined routes
});

// for to resolve the console error
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No Content
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
