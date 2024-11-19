module.exports.isloggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the original URL to the session
    req.flash(
      "error",
      "Access denied. You need to log in to create a new listing"
    );
    return res.redirect("/login");
  }
  next(); // Proceed to the next middleware if authenticated
};

module.exports.redirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectURL = req.session.redirectUrl;
  }
  next();
};
