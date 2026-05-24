// controllers/cartController.js

const Cart = require("../models/Cart");

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

    const items = await Cart.find({
      userEmail: email,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// ADD TO CART
// ==============================
const addToCart = async (req, res) => {
  try {
    const {
      userEmail,
      productId,
      name,
      image,
      category,
      price,
      size,
      qty,
    } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email required",
      });
    }

    // CHECK IF PRODUCT ALREADY EXISTS
    const existingItem = await Cart.findOne({
      userEmail,
      productId,
      size,
    });

    if (existingItem) {
      existingItem.qty += qty || 1;

      await existingItem.save();

      return res.json({
        success: true,
        message: "Cart quantity updated",
        data: existingItem,
      });
    }

    // CREATE NEW ITEM
    const item = new Cart({
      userEmail,
      productId,
      name,
      image,
      category,
      price,
      size,
      qty,
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: "Added To Cart",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// UPDATE CART QTY
// ==============================
const updateCartQty = async (req, res) => {
  try {
    const { qty } = req.body;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.json({
      success: true,
      message: "Quantity updated",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DELETE CART ITEM
// ==============================
const deleteCartItem = async (req, res) => {
  try {
    const { email } = req.body;

    const deleted = await Cart.findOneAndDelete({
      _id: req.params.id,
      userEmail: email,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartQty,
  deleteCartItem,
};