// controllers/cartController.js

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==============================
// GET CART (USER SPECIFIC)
// ==============================
const getCartItems = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email required",
      });
    }

    const items = await Cart.find({ userEmail: email });

    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// ADD TO CART
// ✅ Validates stock from DB and decrements it
// ==============================
const addToCart = async (req, res) => {
  try {
    const { userEmail, productId, name, image, category, price, size, qty } =
      req.body;

    if (!userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User email required" });
    }

    const addQty = qty || 1;

    // ✅ Always read stock from DB — never trust the client
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const currentStock = product.sizes.get(size);
    if (currentStock === undefined) {
      return res
        .status(400)
        .json({ success: false, message: `Size ${size} not found` });
    }

    // ✅ Check if already in cart (same product + size)
    const existingItem = await Cart.findOne({ userEmail, productId, size });

    if (existingItem) {
      const newQty = existingItem.qty + addQty;

      // ✅ Reject if combined qty exceeds stock
      if (newQty > currentStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${currentStock} items available in size ${size}. You already have ${existingItem.qty} in your cart.`,
        });
      }

      existingItem.qty = newQty;
      existingItem.stock = currentStock; // keep snapshot fresh
      await existingItem.save();

      // ✅ Decrement product stock
      product.sizes.set(size, currentStock - addQty);
      await product.save();

      return res.json({
        success: true,
        message: "Cart quantity updated",
        data: existingItem,
      });
    }

    // ✅ New item — check stock
    if (addQty > currentStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentStock} items available in size ${size}`,
      });
    }

    const item = new Cart({
      userEmail,
      productId,
      name,
      image,
      category,
      price,
      size,
      qty: addQty,
      stock: currentStock, // ✅ Save real stock from DB
    });

    await item.save();

    // ✅ Decrement product stock
    product.sizes.set(size, currentStock - addQty);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Added To Cart",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// UPDATE CART QTY
// ✅ Adjusts product stock based on qty change (diff)
// ==============================
const updateCartQty = async (req, res) => {
  try {
    const { qty } = req.body;

    if (qty < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const currentStock = product.sizes.get(cartItem.size) || 0;
    const oldQty = cartItem.qty;
    const diff = qty - oldQty; // positive = wants more, negative = reducing

    // ✅ Only block if user wants MORE than available
    if (diff > 0 && diff > currentStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentStock} more items available in size ${cartItem.size}`,
      });
    }

    // ✅ Adjust product stock by the difference
    product.sizes.set(cartItem.size, currentStock - diff);
    await product.save();

    // ✅ Update cart qty and refresh stock snapshot
    cartItem.qty = qty;
    // stock snapshot = how many are left + what's in the cart (total available if emptied)
    cartItem.stock = currentStock - diff + qty;
    await cartItem.save();

    res.json({
      success: true,
      message: "Quantity updated",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// DELETE CART ITEM
// ✅ Restores product stock when item removed
// ==============================
const deleteCartItem = async (req, res) => {
  try {
    const { email } = req.body;

    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id,
      userEmail: email,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    // ✅ Give stock back to product
    const product = await Product.findById(deleted.productId);
    if (product) {
      const currentStock = product.sizes.get(deleted.size) || 0;
      product.sizes.set(deleted.size, currentStock + deleted.qty);
      await product.save();
    }

    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartQty,
  deleteCartItem,
};