const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// ==========================
// CORS
// ==========================

const allowedOrigins = [
  "https://inspiritclothings.in",
  "https://www.inspiritclothings.in",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // such as Postman/server-side requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.options("*", cors());

// ==========================
// BODY PARSER
// ==========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// DATABASE
// ==========================

connectDB();

// ==========================
// TEST ROUTE
// ==========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "INSPIRIT backend is running",
  });
});

// ==========================
// API ROUTES
// ==========================

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ==========================
// ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;