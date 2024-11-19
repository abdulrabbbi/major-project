const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the User schema with an email field
const UserSchema = new Schema({
  email: {
    type: String, // Email field must be a string
    required: true, // Email is mandatory for each user
  },
});

// Add passport-local-mongoose plugin to the schema
// This plugin adds username, hash, and salt fields to the schema
// and provides convenient methods for user authentication
UserSchema.plugin(passportLocalMongoose);

// Export the User model based on the schema
module.exports = mongoose.model("User", UserSchema);
