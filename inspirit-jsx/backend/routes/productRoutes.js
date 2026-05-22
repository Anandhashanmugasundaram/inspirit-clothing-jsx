const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const Product = require("../models/Product");

// =====================
// HELPER
// =====================
const parseSizes = (sizesString) => {
  const sizesObject = {};

  if (!sizesString) return sizesObject;

  sizesString.split(",").forEach((item) => {
    const [size, stock] = item.split(":");

    if (size && stock !== undefined) {
      sizesObject[size.trim()] = Number(stock);
    }
  });

  return sizesObject;
};

// =====================
// GET PRODUCTS
// =====================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================
// ADD PRODUCT
// =====================
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    console.log("🔥 PRODUCT ROUTE HIT");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const slug = req.body.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const sizesObject = parseSizes(req.body.sizes);

    const product = await Product.create({
      name: req.body.name,
      slug,
      price: Number(req.body.price),
      category: req.body.category,
      description: req.body.description,
      badge: req.body.badge,
      sizes: sizesObject,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("🔥 ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// UPDATE PRODUCT
// =====================
// =====================
// UPDATE PRODUCT
// =====================
router.put(
  "/:id",
  upload.array("images", 10),

  async (req, res) => {
    try {
      console.log("============== UPDATE START ==============");

      console.log("REQ PARAMS:", req.params);

      console.log("REQ BODY:", req.body);

      console.log("REQ FILES:", req.files);

      // FIND PRODUCT
      const product = await Product.findById(req.params.id);

      console.log("FOUND PRODUCT:", product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // =====================
      // BASIC FIELDS
      // =====================
      product.name = req.body.name || product.name;

      product.price = req.body.price
        ? Number(req.body.price)
        : product.price;

      product.category = req.body.category || product.category;

      product.description =
        req.body.description || product.description;

      product.badge = req.body.badge || product.badge;

      console.log("BASIC FIELDS UPDATED");

      // =====================
      // SLUG
      // =====================
      if (req.body.name) {
        product.slug = req.body.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
      }

      console.log("SLUG UPDATED");

      // =====================
      // SIZES
      // =====================
      if (req.body.sizes) {
        console.log("RAW SIZES:", req.body.sizes);

        const sizesObject = parseSizes(req.body.sizes);

        console.log("PARSED SIZES:", sizesObject);

        product.sizes = sizesObject;

        console.log("PRODUCT SIZES SET");
      }

      // =====================
      // NEW IMAGES
      // =====================
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }));

        console.log("NEW IMAGES:", newImages);

        product.images = [
          ...product.images,
          ...newImages,
        ];

        console.log("IMAGES UPDATED");
      }

      // =====================
      // BEFORE SAVE
      // =====================
      console.log("FINAL PRODUCT:", product);

      await product.save();

      console.log("PRODUCT SAVED");

      res.json({
        success: true,
        product,
      });

      console.log("============== UPDATE END ==============");
    } catch (error) {
      console.log("============== UPDATE ERROR ==============");

      console.log(error);

      console.log("ERROR MESSAGE:", error.message);

      console.log("STACK:", error.stack);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);
// =====================
// DELETE PRODUCT
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// DELETE SINGLE IMAGE
// =====================
router.delete("/:id/image/:public_id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const publicId = decodeURIComponent(req.params.public_id);

    product.images = product.images.filter((img) => img.public_id !== publicId);

    await product.save();

    res.json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
