const User = require("../models/user");

// Render Signup Page
module.exports.renderSignUpPage = (req, res) => {
  res.render("user/signup.ejs");
};

// Register a New User
module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email }); // Create user instance
    const registeredUser = await User.register(newUser, password); // Register user with hashed password

    // Log in the newly registered user
    req.login(registeredUser, (err) => {
      if (err) return next(err); // Pass errors to Express's error handler
      req.flash("success", "Welcome to Wandurlust!");
      res.redirect("/listing"); // Redirect to the main listings page
    });
  } catch (err) {
    req.flash("error", err.message); // Flash error message
    res.redirect("/signup"); // Redirect back to signup form
  }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

// Handle Login Success
module.exports.saveLoginData = (req, res) => {
  req.flash(
    "success",
    "Welcome back to Wandurlust! You have successfully logged in."
  );
  const redirectUrl = res.locals.redirectURL || "/listing"; // Use redirect URL if available, default to /listing
  res.redirect(redirectUrl);
};

// Handle Logout
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err); // Handle errors during logout
    req.flash("success", "You have successfully logged out.");
    res.redirect("/listing"); // Redirect to main page after logout
  });
};
