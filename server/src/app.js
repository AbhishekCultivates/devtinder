const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from the React app (frontend)
if (process.env.NODE_ENV === "production") {
  // Serve static files from 'client/dist' after building frontend
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Catch-all route to serve the frontend (React app) for all routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// Welcome message for the API
app.get("/", (req, res) => {
  res.send("Welcome to the devTinder backend API!");
});

// Import routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// API routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 7777;

// Database connection and server start
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(Server is successfully listening on port ${PORT}...);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
    console.log(err);
  });