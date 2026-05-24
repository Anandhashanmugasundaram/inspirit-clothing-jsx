const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ======================
// CREATE ORDER
// ======================
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      customer,
      items,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items in order",
      });
    }

    // ======================
    // FORMAT ITEMS (IMPORTANT)
    // ======================
    const formattedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      qty: item.qty,
      size: item.size,
    }));

    // ======================
    // CHECK STOCK + REDUCE
    // ======================
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      const currentStock = product.sizes.get(item.size) || 0;

      if (currentStock < item.qty) {
        return res.status(400).json({
          message: `Only ${currentStock} left for ${product.name} (${item.size})`,
        });
      }

      product.sizes.set(
        item.size,
        currentStock - item.qty
      );

      product.markModified("sizes");
      await product.save();
    }

    // ======================
    // CREATE ORDER
    // ======================
    const order = await Order.create({
      userEmail,
      customer,
      items: formattedItems,
      subtotal,
      shipping,
      total,
      status: "Pending",
    });

    res.json(order);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// GET ALL ORDERS (ADMIN)
// ======================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// GET USER ORDERS
// ======================
router.get("/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// UPDATE STATUS
// ======================
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// DELETE ORDER
// ======================
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;