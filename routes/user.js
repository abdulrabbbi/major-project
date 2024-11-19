const express = require("express");
const router = express();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { redirectURL } = require("../middleware/islogin");

//render the signup page
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

//to register the user through signup
router.post(
  "/signup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new User({ username, email });
      let registerUser = await User.register(newuser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to wandurlust!");
        res.redirect("/listing");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

//for login the user
router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

// login the data from user
router.post(
  "/login",
  redirectURL,
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect back to login if authentication fails
    failureFlash: true, // Flash message if login fails
  }),
  async (req, res) => {
    req.flash(
      "success",
      "Welcome back to wandurlust! You have successfully logged in"
    );
    let redirecturl = res.locals.redirectURL || "/listing";
    res.redirect(redirecturl);
  }
);

// logout route
router.get("/logout",redirectURL, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out");
    res.redirect("./listing");
  });
});

module.exports = router;
