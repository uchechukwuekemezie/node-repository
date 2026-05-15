// initialise and call the user.js file in the models folder to this file to connect to the database

const mongoose = require("mongoose");
const User = require("../models/user"); // this imports the user model to this file

const MONGO_URI =
  "mongodb+srv://ucheemekaekemezie_db_user:274H5JAAhsPQj5UL@cluster0.evpf89n.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    // connect to mongoDB
    await mongoose.connect(MONGO_URI);
    console.log("mongodb connected successfully");

    // create the empty user collection in the database
    await User.createCollection();
    console.log("user collection created successfully");
  } catch (err) {
    console.error("mongodb connection failed", err.message);
    process.exit(1); // this is to exit the process if the connection fails
  }
};

connectDB(); // call the connectDB function to connect to the database

module.exports = connectDB; // export the connectdb function to be used in other files
