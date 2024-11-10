const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1719299225324-301bad5c333c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZpbGxhc3xlbnwwfHwwfHx8MA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1719299225324-301bad5c333c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZpbGxhc3xlbnwwfHwwfHx8MA%3D%3D"
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  Review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",  
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
