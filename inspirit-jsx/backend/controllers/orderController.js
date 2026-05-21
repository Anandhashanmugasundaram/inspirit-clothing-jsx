const Order =
  require("../models/Order");

// =====================
// GET ALL ORDERS
// =====================
const getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================
// CREATE ORDER
// =====================
const createOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.create(req.body);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================
// UPDATE STATUS
// =====================
const updateOrderStatus =
  async (req, res) => {
    try {
      const updated =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
        );

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// =====================
// DELETE ORDER
// =====================
const deleteOrder =
  async (req, res) => {
    try {
      await Order.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};