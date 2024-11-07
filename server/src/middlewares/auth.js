const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please login!");
    }

    // Verify the token with the secret stored in the environment variable
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    // Fetch the user from the database using the decoded token's user ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach the user to the request object for use in subsequent middleware/routes
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token has expired, please login again");
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token, please login again");
    } else {
      return res.status(500).send("Internal server error: " + err.message);
    }
  }
};

module.exports = {
  userAuth,
};
