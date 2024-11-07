const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // Set the cookie with secure attributes in production
    res.cookie("token", token, {
      httpOnly: true, // Make the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: "None", // Needed for cross-site cookies
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      domain:
        process.env.NODE_ENV === "production"
          ? "devtinder-ujzk.onrender.com" // Set the domain to match the subdomain
          : "localhost", // Use localhost for development
    });

    res.json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // Set the cookie with secure attributes in production
      res.cookie("token", token, {
        httpOnly: true, // Make the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        sameSite: "None", // Needed for cross-site cookies
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours
        domain:
          process.env.NODE_ENV === "production"
            ? "devtinder-ujzk.onrender.com" // Set the domain to match the subdomain
            : "localhost", // Use localhost for development
      });

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // Clear the cookie by setting an expired date
  res.cookie("token", null, {
    expires: new Date(Date.now() - 1000), // Expire the cookie immediately
    httpOnly: true, // Make sure the cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
    sameSite: "None", // Needed for cross-site cookies
    domain:
      process.env.NODE_ENV === "production"
        ? "devtinder-ujzk.onrender.com" // Set the domain for production vs development
        : "localhost", // Use localhost for development
  });

  res.send("Logout successful!");
});

module.exports = authRouter;
