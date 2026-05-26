// routes/cartRoutes.js

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
// ✅ Restores stock for all items before clearing
// ======================
// ✅ MUST be before router.delete("/:id", ...)
router.delete("/clear/:email", async (req, res) => {
  try {
    const items = await Cart.find({ userEmail: req.params.email });

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const currentStock = product.sizes.get(item.size) || 0;
        product.sizes.set(item.size, currentStock + item.qty);
        await product.save();
      }
    }

    await Cart.deleteMany({ userEmail: req.params.email });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ⚠️ This must come AFTER /clear/:email
router.delete("/:id", deleteCartItem);

module.exports = router;