const express = require("express");

const User =
  require("../models/User");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();


// UPDATE USER
router.put(
  "/update",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });

      }

      user.name =
        req.body.name || user.name;

      user.email =
        req.body.email || user.email;

      await user.save();

      res.json({
        success: true,
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server error",
      });

    }

  }
);

module.exports = router;