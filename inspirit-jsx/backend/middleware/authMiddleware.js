const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // CHECK TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // GET USER
      req.user = await User.findById(
        decoded.id
      ).select("-password");

      next();
    } else {
      return res.status(401).json({
        message: "No token provided",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Token failed",
    });
  }
};

module.exports = authMiddleware;