const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Use the MongoDB URI from the environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process with failure code
  }
};

module.exports = connectDB;
