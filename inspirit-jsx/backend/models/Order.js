const mongoose = require("mongoose");

const orderSchema =
  new mongoose.Schema(
    {
      userEmail: String,

      products: Array,

      total: Number,

      status: {
        type: String,
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );