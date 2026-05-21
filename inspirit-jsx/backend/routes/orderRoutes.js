const express = require("express");

const router =
  express.Router();

const {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require(
  "../controllers/orderController"
);

router.get("/", getOrders);

router.post("/", createOrder);

router.put(
  "/:id",
  updateOrderStatus
);

router.delete(
  "/:id",
  deleteOrder
);

module.exports = router;