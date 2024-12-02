const mongoose = require("mongoose");
const initdb = require("./data");
const Listing = require("../models/listing");
const mapbox = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mapbox({
  accessToken:
    "pk.eyJ1IjoiYWJkdWxyYWJpIiwiYSI6ImNtM3dpbzZzOTB6enYyaXM1aWJkbXYwOTgifQ.DoYNdnxU8wYBV4h7pe3E-g",
}); // Add your Mapbox token here

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://abdul67848:1JGWiuizCi76s470@cluster0.pklmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { tlsInsecure: true }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

main();

const initdatabase = async () => {
  try {
    // Validate the data array
    if (!Array.isArray(initdb.data)) {
      console.error("Initialization data is not an array.");
      process.exit(1);
    }

    // Delete existing listings
    await Listing.deleteMany();

    // Loop through the data and populate geometry
    for (let oneListing of initdb.data) {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: oneListing.location,
            limit: 1,
          })
          .send();

        if (response.body.features.length === 0) {
          console.error(
            `No geocoding results for location "${oneListing.location}".`
          );
          continue; // Skip this listing
        }

        // Add geometry and owner to the listing
        oneListing.geometry = response.body.features[0].geometry;
        oneListing.owner = "674aaa527bcb2a02f216715d";
      } catch (geoError) {
        console.error(
          `Failed to geocode location "${oneListing.location}":`,
          geoError
        );
        continue; // Skip this listing if geocoding fails
      }
    }

    // Insert updated data into MongoDB
    await Listing.insertMany(initdb.data);
    console.log("Database initialized with listings.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection to MongoDB closed.");
  }
};

initdatabase();
