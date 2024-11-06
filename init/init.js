const mongoose = require("mongoose");
const initdb = require("./data");
const Listing = require("../models/listing");



const mongoUrl = "mongodb://127.0.0.1:27017/Wandurlust";
async function main() {
  await mongoose.connect(mongoUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

const initdatabase = async () => {
    await Listing.deleteMany();
    await Listing.insertMany(initdb.data);
    console.log("your data is done");
}

initdatabase();


