const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    description: String,
    badge: String,

    sizes: [String],

    images: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);