const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ==========================
// CLOUDINARY STORAGE
// ==========================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "inspirit-products",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    resource_type: "image",

    // Automatically optimize uploaded images
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

// ==========================
// MULTER
// ==========================
const upload = multer({
  storage,

  limits: {
    // 10 MB maximum PER IMAGE
    fileSize: 10 * 1024 * 1024,

    // Maximum number of images
    files: 10,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

module.exports = upload;