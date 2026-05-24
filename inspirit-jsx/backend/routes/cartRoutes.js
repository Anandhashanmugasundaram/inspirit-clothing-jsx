// routes/cartRoutes.js

const express = require("express");

const router = express.Router();

const Cart = require("../models/Cart");

const {
  getCartItems,
  addToCart,
  updateCartQty,
  deleteCartItem,
} = require("../controllers/cartController");

// ======================
// GET CART
// ======================
router.get("/", getCartItems);

// ======================
// ADD TO CART
// ======================
router.post("/", addToCart);

// ======================
// UPDATE QTY
// ======================
router.put("/:id", updateCartQty);

// ======================
// DELETE ITEM
// ======================
router.delete("/:id", deleteCartItem);

// ======================
// CLEAR USER CART
// ======================
router.delete("/clear/:email", async (req, res) => {
  try {
    await Cart.deleteMany({
      userEmail: req.params.email,
    });

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;