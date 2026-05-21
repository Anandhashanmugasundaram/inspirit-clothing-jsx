const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const Product =
  require("../models/Product");

// =====================
// GET PRODUCTS
// =====================
router.get("/", async (req, res) => {

  try {

    const products =
      await Product.find().sort({
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
router.post(
  "/",
  upload.array("images", 10),

  async (req, res) => {
    try {

      console.log(req.files);

      const imageUrls =
        req.files.map(
          (file) => file.path
        );

      const product =
        await Product.create({
          name: req.body.name,

          price: Number(
            req.body.price
          ),

          category:
            req.body.category,

          description:
            req.body.description,

          badge: req.body.badge,

          sizes:
            req.body.sizes
              .split(","),

          images: imageUrls,
        });

      res.status(201).json({
        success: true,
        product,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  }
);

// =====================
// UPDATE PRODUCT
// =====================
router.put("/:id", async (req, res) => {

  try {

    const updated =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
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

});

// =====================
// DELETE PRODUCT
// =====================
router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(
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

});

module.exports = router;