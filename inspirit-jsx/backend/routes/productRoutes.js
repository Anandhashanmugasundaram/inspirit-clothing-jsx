const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// ==========================
// PARSE SIZES HELPER
// Accepts both:
//   "S:2,M:5,L:5,XL:3"   (admin form input)
//   '{"S":2,"M":5}'       (valid JSON)
// ==========================
const parseSizes = (str) => {
  if (!str) return {};
  // Try JSON first
  try {
    return JSON.parse(str);
  } catch {}
  // Fall back to S:2,M:5 format
  return Object.fromEntries(
    str.split(",").map((pair) => {
      const [key, val] = pair.split(":");
      return [key.trim(), Number(val.trim())];
    })
  );
};

// ==========================
// GET ALL PRODUCTS
// ==========================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// GET SINGLE PRODUCT
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// CREATE PRODUCT
// ==========================
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { name, slug, price, category, description, badge, sizes, isSpecialOffer } = req.body;

    const uploadedImages = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: "inspirit" });
      uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
    }

    const product = await Product.create({
      name,
      slug,
      price,
      category,
      description,
      badge,
      isSpecialOffer,
      sizes: parseSizes(sizes), // ✅ handles both formats
      images: uploadedImages,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// UPDATE PRODUCT
// ==========================
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, slug, price, category, description, badge, sizes, isSpecialOffer } = req.body;

    const newImages = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: "inspirit" });
      newImages.push({ url: result.secure_url, public_id: result.public_id });
    }

    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.badge = badge !== undefined ? badge : product.badge;
    product.isSpecialOffer = isSpecialOffer ?? product.isSpecialOffer;
    product.sizes = sizes ? parseSizes(sizes) : product.sizes; // ✅ handles both formats
    if (newImages.length > 0) product.images = newImages;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// DELETE PRODUCT
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const img of product.images || []) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;