const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: String,

    name: String,

    image: String,

    category: String,

    price: Number,

    size: String,

    qty: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Cart",
  cartSchema
);