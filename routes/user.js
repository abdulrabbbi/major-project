const express = require("express");
const router = express.Router(); // Use `Router()` for modular route handling
const passport = require("passport");

const User = require("../models/user");
const wrapAsync = require("../utils/wrapasync"); // Utility for async error handling
const { redirectURL } = require("../middleware/islogin"); // Middleware to handle redirection
const UserController = require("../controllers/user");

// User Authentication Routes

// 1. Signup Route
router
  .route("/signup")
  .get(UserController.renderSignUpPage) // Render the signup form
  .post(wrapAsync(UserController.registerUser)); // Handle user registration

// 2. Login Route
router
  .route("/login")
  .get(UserController.renderLoginForm) // Render the login form
  .post(
    redirectURL, // Custom middleware to handle redirects
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirect to login on failure
      failureFlash: true, // Enable flash messages for login errors
    }),
    UserController.saveLoginData // Handle login success logic
  );

// 3. Logout Route
router.get("/logout", redirectURL, UserController.logoutUser); // Log out the user and redirect

module.exports = router;
