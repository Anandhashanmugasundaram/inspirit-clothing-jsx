// const multer = require("multer");
// const {
//   CloudinaryStorage,
// } = require("multer-storage-cloudinary");

// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,

//   params: {
//     folder: "inspirit",
//     allowed_formats: [
//       "jpg",
//       "jpeg",
//       "png",
//       "webp",
//     ],
//   },
// });

// const upload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//     files: 5,
//   },
// });

// module.exports = upload;


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// =====================================
// CLOUDINARY STORAGE
// =====================================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    return {
      folder: "inspirit-products",

      resource_type: "image",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "avif",
      ],

      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/[^a-zA-Z0-9-_]/g, "-")}`,
    };
  },
});

// =====================================
// MULTER
// =====================================

const upload = multer({
  storage: storage,

  limits: {
    // 10 MB maximum per file
    fileSize: 10 * 1024 * 1024,

    // Maximum number of files in one request
    files: 10,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed."
        ),
        false
      );
    }
  },
});

module.exports = upload;