const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      console.error("No token found in cookies");
      return res.status(401).send("Please login!");
    }

    console.log("Token found in cookies:", token);

    // Attempt to verify the token using the secret stored in the environment variable
    let decodedObj;
    try {
      decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token successfully decoded:", decodedObj);
    } catch (err) {
      console.error("Error verifying token:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).send("Token has expired, please login again");
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).send("Invalid token, please login again");
      } else {
        return res.status(500).send("Internal server error: " + err.message);
      }
    }

    const { _id } = decodedObj;

    // Fetch the user from the database using the decoded token's user ID
    console.log("Fetching user with _id:", _id);
    const user = await User.findById(_id);

    if (!user) {
      console.error("User not found for _id:", _id);
      return res.status(404).send("User not found");
    }

    // Attach the user to the request object for use in subsequent middleware/routes
    req.user = user;
    console.log("User authenticated successfully:", user);

    next();
  } catch (err) {
    console.error("Error in userAuth middleware:", err);
    return res.status(500).send("Internal server error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
