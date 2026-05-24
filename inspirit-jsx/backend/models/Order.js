const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },

    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        qty: Number,
        size: String,
      },
    ],

    subtotal: Number,
    shipping: Number,
    total: Number,

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);