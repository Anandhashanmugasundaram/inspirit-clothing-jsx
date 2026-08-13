// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const cloudinary = require("../config/cloudinary");
// const upload = require("../middleware/upload"); // ✅ use your existing middleware

// // ==========================
// // PARSE SIZES HELPER
// // ==========================
// const parseSizes = (str) => {
//   if (!str) return {};
//   try {
//     return JSON.parse(str);
//   } catch (error) {
//     return Object.fromEntries(
//       str.split(",").map((pair) => {
//         const [key, val] = pair.split(":");
//         return [key.trim(), Number(val.trim())];
//       })
//     );
//   }
// };

// // ==========================
// // AUTO GENERATE SLUG
// // ==========================
// const generateSlug = (name) =>
//   name
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

// // ==========================
// // GET ALL PRODUCTS
// // ==========================
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// // ==========================
// // GET SINGLE PRODUCT
// // ==========================
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// // ==========================
// // CREATE PRODUCT
// // ==========================
// router.post("/", upload.array("images"), async (req, res) => {
//   try {
//     const {
//       name,
//       price,
//       category,
//       description,
//       badge,
//       sizes,
//       isSpecialOffer,
//     } = req.body;

//     const slug = req.body.slug?.trim()
//       ? req.body.slug.trim()
//       : generateSlug(name);

//     // ✅ multer-storage-cloudinary already uploaded — just read file.path and file.filename
//     const uploadedImages = (req.files || []).map((file) => ({
//       url: file.path,
//       public_id: file.filename,
//     }));

//     const product = await Product.create({
//       name,
//       slug,
//       price,
//       category,
//       description,
//       badge,
//       isSpecialOffer: isSpecialOffer === "true" || isSpecialOffer === true,
//       sizes: parseSizes(sizes),
//       images: uploadedImages,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// // ==========================
// // UPDATE PRODUCT
// // ==========================
// router.put("/:id", upload.array("images"), async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     const {
//       name,
//       price,
//       category,
//       description,
//       badge,
//       sizes,
//       isSpecialOffer,
//     } = req.body;

//     const slug = req.body.slug?.trim()
//       ? req.body.slug.trim()
//       : name
//       ? generateSlug(name)
//       : product.slug;

//     // ✅ same fix for update
//     const newImages = (req.files || []).map((file) => ({
//       url: file.path,
//       public_id: file.filename,
//     }));

//     product.name = name || product.name;
//     product.slug = slug;
//     product.price = price || product.price;
//     product.category = category || product.category;
//     product.description =
//       description !== undefined ? description : product.description;
//     product.badge = badge !== undefined ? badge : product.badge;
//     product.isSpecialOffer =
//       isSpecialOffer !== undefined
//         ? isSpecialOffer === "true" || isSpecialOffer === true
//         : product.isSpecialOffer;
//     product.sizes = sizes ? parseSizes(sizes) : product.sizes;
//     if (newImages.length > 0) product.images = newImages;

//     await product.save();
//     res.json(product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// // ==========================
// // DELETE PRODUCT
// // ==========================
// router.delete("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     for (const img of product.images || []) {
//       try {
//         await cloudinary.uploader.destroy(img.public_id);
//       } catch (err) {
//         console.log("Cloudinary delete error:", err.message);
//       }
//     }

//     await product.deleteOne();
//     res.json({ success: true });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// // ==========================
// // DELETE SINGLE IMAGE
// // ==========================
// router.delete("/:id/image/:publicId", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     const publicId = decodeURIComponent(req.params.publicId);

//     try {
//       await cloudinary.uploader.destroy(publicId);
//     } catch (err) {
//       console.log("Cloudinary image delete error:", err.message);
//     }

//     product.images = product.images.filter(
//       (img) => img.public_id !== publicId
//     );

//     await product.save();
//     res.json({ success: true });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

// ======================================================
// PARSE SIZES HELPER
// ======================================================
const parseSizes = (value) => {
  if (!value) return {};

  // Already an object
  if (typeof value === "object") {
    return value;
  }

  try {
    // Example:
    // {"S":10,"M":20,"L":15}
    return JSON.parse(value);
  } catch (error) {
    // Example:
    // S:10,M:20,L:15
    try {
      return Object.fromEntries(
        value
          .split(",")
          .map((pair) => {
            const [key, val] = pair.split(":");

            return [
              key.trim(),
              Number(val?.trim() || 0)
            ];
          })
          .filter(([key]) => key)
      );
    } catch (err) {
      return {};
    }
  }
};

// ======================================================
// AUTO GENERATE SLUG
// ======================================================
const generateSlug = (name = "") => {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
});

// ======================================================
// GET SINGLE PRODUCT
// ======================================================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("GET SINGLE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
});

// ======================================================
// CREATE PRODUCT
// ======================================================
router.post(
  "/",
  upload.array("images", 10),
  async (req, res) => {
    try {
      console.log("========== CREATE PRODUCT ==========");
      console.log("Body:", req.body);
      console.log(
        "Files:",
        req.files?.length || 0
      );

      const {
        name,
        price,
        category,
        description,
        badge,
        sizes,
        isSpecialOffer
      } = req.body;

      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------
      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Product name is required"
        });
      }

      if (!price) {
        return res.status(400).json({
          message: "Product price is required"
        });
      }

      // ----------------------------------------------
      // SLUG
      // ----------------------------------------------
      const slug =
        req.body.slug && req.body.slug.trim()
          ? req.body.slug.trim()
          : generateSlug(name);

      // ----------------------------------------------
      // CLOUDINARY IMAGES
      // ----------------------------------------------
      const uploadedImages = (req.files || []).map(
        (file) => ({
          url: file.path,
          public_id: file.filename
        })
      );

      // ----------------------------------------------
      // CREATE PRODUCT
      // ----------------------------------------------
      const product = await Product.create({
        name: name.trim(),

        slug,

        price: Number(price),

        category,

        description,

        badge,

        isSpecialOffer:
          isSpecialOffer === true ||
          isSpecialOffer === "true",

        sizes: parseSizes(sizes),

        images: uploadedImages
      });

      console.log(
        "Product created:",
        product._id
      );

      return res.status(201).json(product);
    } catch (error) {
      console.error(
        "CREATE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message: error.message
      });
    }
  }
);

// ======================================================
// UPDATE PRODUCT
// ======================================================
router.put(
  "/:id",
  upload.array("images", 10),
  async (req, res) => {
    try {
      console.log("========== UPDATE PRODUCT ==========");

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const {
        name,
        price,
        category,
        description,
        badge,
        sizes,
        isSpecialOffer
      } = req.body;

      // ----------------------------------------------
      // SLUG
      // ----------------------------------------------
      const slug =
        req.body.slug && req.body.slug.trim()
          ? req.body.slug.trim()
          : name
          ? generateSlug(name)
          : product.slug;

      // ----------------------------------------------
      // NEW CLOUDINARY IMAGES
      // ----------------------------------------------
      const newImages = (req.files || []).map(
        (file) => ({
          url: file.path,
          public_id: file.filename
        })
      );

      // ----------------------------------------------
      // UPDATE FIELDS
      // ----------------------------------------------
      if (name !== undefined) {
        product.name = name.trim();
      }

      product.slug = slug;

      if (price !== undefined && price !== "") {
        product.price = Number(price);
      }

      if (category !== undefined) {
        product.category = category;
      }

      if (description !== undefined) {
        product.description = description;
      }

      if (badge !== undefined) {
        product.badge = badge;
      }

      if (isSpecialOffer !== undefined) {
        product.isSpecialOffer =
          isSpecialOffer === true ||
          isSpecialOffer === "true";
      }

      if (sizes !== undefined && sizes !== "") {
        product.sizes = parseSizes(sizes);
      }

      // ----------------------------------------------
      // REPLACE IMAGES ONLY IF NEW IMAGES EXIST
      // ----------------------------------------------
      if (newImages.length > 0) {
        product.images = newImages;
      }

      await product.save();

      console.log(
        "Product updated:",
        product._id
      );

      return res.status(200).json(product);
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message: error.message
      });
    }
  }
);

// ======================================================
// DELETE PRODUCT
// ======================================================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // ----------------------------------------------
    // DELETE ALL CLOUDINARY IMAGES
    // ----------------------------------------------
    for (const image of product.images || []) {
      if (!image.public_id) continue;

      try {
        await cloudinary.uploader.destroy(
          image.public_id
        );
      } catch (error) {
        console.error(
          "Cloudinary delete error:",
          error.message
        );
      }
    }

    // ----------------------------------------------
    // DELETE PRODUCT FROM DATABASE
    // ----------------------------------------------
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
});

// ======================================================
// DELETE SINGLE IMAGE
// ======================================================
router.delete(
  "/:id/image/:publicId",
  async (req, res) => {
    try {
      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const publicId = decodeURIComponent(
        req.params.publicId
      );

      // ----------------------------------------------
      // DELETE FROM CLOUDINARY
      // ----------------------------------------------
      try {
        await cloudinary.uploader.destroy(
          publicId
        );
      } catch (error) {
        console.error(
          "Cloudinary image delete error:",
          error.message
        );
      }

      // ----------------------------------------------
      // DELETE FROM MONGODB
      // ----------------------------------------------
      product.images = (
        product.images || []
      ).filter(
        (image) =>
          image.public_id !== publicId
      );

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully"
      });
    } catch (error) {
      console.error(
        "DELETE SINGLE IMAGE ERROR:",
        error
      );

      return res.status(500).json({
        message: error.message
      });
    }
  }
);

// ======================================================
// MULTER ERROR HANDLER
// ======================================================
router.use(
  (error, req, res, next) => {
    console.error(
      "PRODUCT UPLOAD ERROR:",
      error
    );

    if (
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        message:
          "Image is too large. Maximum allowed size is 10 MB per image."
      });
    }

    if (
      error.code === "LIMIT_FILE_COUNT"
    ) {
      return res.status(400).json({
        message:
          "Too many images uploaded."
      });
    }

    return res.status(500).json({
      message:
        error.message ||
        "File upload failed"
    });
  }
);

module.exports = router;