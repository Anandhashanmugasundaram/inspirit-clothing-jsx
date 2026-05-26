const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const {
  getCartItems,
  addToCart,
  updateCartQty,
  deleteCartItem,
} = require("../controllers/cartController");

router.get("/", getCartItems);
router.post("/", addToCart);
router.put("/:id", updateCartQty);

// ✅ MUST be before /:id
// ✅ After order — just clear cart, stock stays decremented
router.delete("/clear/:email", async (req, res) => {
  try {
    await Cart.deleteMany({ userEmail: req.params.email });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ AFTER /clear/:email
router.delete("/:id", deleteCartItem);

module.exports = router;