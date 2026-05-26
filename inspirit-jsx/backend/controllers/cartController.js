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

    const existingItem = await Cart.findOne({ userEmail, productId, size });

    if (existingItem) {
      const newQty = existingItem.qty + addQty;

      if (newQty > currentStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${currentStock} items available in size ${size}. You already have ${existingItem.qty} in your cart.`,
        });
      }

      existingItem.qty = newQty;
      existingItem.stock = currentStock;
      await existingItem.save();

      product.sizes.set(size, currentStock - addQty);
      product.markModified("sizes"); // ✅
      await product.save();

      return res.json({
        success: true,
        message: "Cart quantity updated",
        data: existingItem,
      });
    }

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
      stock: currentStock,
    });

    await item.save();

    product.sizes.set(size, currentStock - addQty);
    product.markModified("sizes"); // ✅
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
    const diff = qty - oldQty;

    if (diff > 0 && diff > currentStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${currentStock} more items available in size ${cartItem.size}`,
      });
    }

    product.sizes.set(cartItem.size, currentStock - diff);
    product.markModified("sizes"); // ✅
    await product.save();

    cartItem.qty = qty;
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

    const product = await Product.findById(deleted.productId);
    if (product) {
      const currentStock = product.sizes.get(deleted.size) || 0;
      product.sizes.set(deleted.size, currentStock + deleted.qty);
      product.markModified("sizes"); // ✅
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