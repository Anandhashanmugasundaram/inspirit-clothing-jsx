const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// ==========================
// PARSE SIZES HELPER
// ==========================
const parseSizes = (str) => {
  if (!str) return {};

  try {
    return JSON.parse(str);
  } catch (error) {
    console.log("JSON parse failed, using manual parser");

    return Object.fromEntries(
      str.split(",").map((pair) => {
        const [key, val] = pair.split(":");

        return [
          key.trim(),
          Number(val.trim()),
        ];
      })
    );
  }
};

// ==========================
// AUTO GENERATE SLUG
// ==========================
const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ==========================
// GET ALL PRODUCTS
// ==========================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
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
  }catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
});

// ==========================
// CREATE PRODUCT
// ==========================
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      badge,
      sizes,
      isSpecialOffer,
    } = req.body;

    // Auto-generate slug from name
    const slug = req.body.slug?.trim()
      ? req.body.slug.trim()
      : generateSlug(name);

    const uploadedImages = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "inspirit",
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const product = await Product.create({
      name,
      slug,
      price,
      category,
      description,
      badge,
      isSpecialOffer: isSpecialOffer === "true" || isSpecialOffer === true,
      sizes: parseSizes(sizes),
      images: uploadedImages,
    });

    res.status(201).json(product);
  } catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
});

// ==========================
// UPDATE PRODUCT
// ==========================
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      price,
      category,
      description,
      badge,
      sizes,
      isSpecialOffer,
    } = req.body;

    // Auto-generate slug if name changed and no slug provided
    const slug = req.body.slug?.trim()
      ? req.body.slug.trim()
      : name
      ? generateSlug(name)
      : product.slug;

    const newImages = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "inspirit",
      });
      newImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    product.name = name || product.name;
    product.slug = slug;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description !== undefined ? description : product.description;
    product.badge = badge !== undefined ? badge : product.badge;
    product.isSpecialOffer =
      isSpecialOffer !== undefined
        ? isSpecialOffer === "true" || isSpecialOffer === true
        : product.isSpecialOffer;
    product.sizes = sizes ? parseSizes(sizes) : product.sizes;
    if (newImages.length > 0) product.images = newImages;

    await product.save();
    res.json(product);
  } catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
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
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

    await product.deleteOne();
    res.json({ success: true });
  } catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
});

// ==========================
// DELETE SINGLE IMAGE
// ==========================
router.delete("/:id/image/:publicId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const publicId = decodeURIComponent(req.params.publicId);

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.log("Cloudinary image delete error:", err.message);
    }

    product.images = product.images.filter(
      (img) => img.public_id !== publicId
    );

    await product.save();
    res.json({ success: true });
  } catch (error) {
  console.log(error);
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
});

module.exports = router;