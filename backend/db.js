import mongoose from "mongoose";

// MongoDB connection URI
const MONGO_URI = "mongodb://127.0.0.1:27017/SpotifyClone";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
  });
