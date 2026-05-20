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
// DELETE CART ITEM
// ==============================
const deleteCartItem = async (req, res) => {
  try {
    const { email } = req.body;

    await Cart.findOneAndDelete({
      _id: req.params.id,
      userEmail: email,
    });

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  deleteCartItem,
};