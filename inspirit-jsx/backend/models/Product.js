const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    price: Number,
    category: String,
    description: String,
    badge: String,
     sizes: {
      type: Map,
      of: Number,
    },
    images: [
  {
    url: String,
    public_id: String,
  },
]
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
