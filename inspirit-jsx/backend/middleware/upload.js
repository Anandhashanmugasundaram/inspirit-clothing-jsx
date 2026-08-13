const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "inspirit",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Multer setup
const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 5MB limit (important for Render)
  },
});

module.exports = upload;