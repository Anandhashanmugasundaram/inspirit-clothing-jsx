const express = require("express");

const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// ==========================
// CREATE ORDER
// ==========================
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      items,
      total,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ==========================
    // CHECK STOCK
    // ==========================
    for (const item of items) {
      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      const currentStock =
        product.sizes.get(item.size) || 0;

      // OUT OF STOCK
      if (currentStock <= 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.size}) is out of stock`,
        });
      }

      // NOT ENOUGH STOCK
      if (currentStock < item.qty) {
        return res.status(400).json({
          success: false,
          message:
            `Only ${currentStock} left for ${product.name} (${item.size})`,
        });
      }
    }

    // ==========================
    // CREATE ORDER
    // ==========================
    const order = await Order.create({
      userEmail,

      items,

      total,

      shippingAddress,

      paymentMethod,

      status: "Processing",
    });

    // ==========================
    // REDUCE STOCK
    // ==========================
    for (const item of items) {
      const product =
        await Product.findById(
          item.productId
        );

      if (!product) continue;

      const currentStock =
        product.sizes.get(item.size) || 0;

      const newStock =
        currentStock - item.qty;

console.log("BEFORE:", product.sizes);

product.sizes.set(
  item.size,
  currentStock - item.qty
);

product.markModified("sizes");

console.log("AFTER:", product.sizes);

await product.save();

console.log("SAVED");
    }

    // ==========================
    // CLEAR USER CART
    // ==========================
    await Cart.deleteMany({
      userEmail,
    });

    // ==========================
    // SUCCESS
    // ==========================
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {

    console.log("ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// GET USER ORDERS
// ==========================
router.get("/:email", async (req, res) => {
  try {

    const orders =
      await Order.find({
        userEmail: req.params.email,
      }).sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// GET ALL ORDERS (ADMIN)
// ==========================
router.get("/", async (req, res) => {
  try {

    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// UPDATE ORDER STATUS
// ==========================
router.put("/:id", async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status =
      req.body.status || order.status;

    await order.save();

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================
// DELETE ORDER
// ==========================
router.delete("/:id", async (req, res) => {
  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Order deleted",
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