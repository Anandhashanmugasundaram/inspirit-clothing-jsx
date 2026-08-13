const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ==========================
// DATABASE
// ==========================
connectDB();

// ==========================
// CORS
// ==========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://inspiritclothings.in",
  "https://www.inspiritclothings.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // Example: Postman, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// IMPORTANT:
// Do NOT use app.options("*", ...) with your current Express version.

// ==========================
// BODY PARSERS
// ==========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==========================
// TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "INSPIRIT API is running",
  });
});

// ==========================
// ROUTES
// ==========================
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Add your other routes here if you have them
// app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/wishlist", wishlistRoutes);

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================
// ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("SERVER ERROR");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("=================================");

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked this origin",
      origin: req.headers.origin || null,
    });
  }

  // Multer / upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================
// LOCAL SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});