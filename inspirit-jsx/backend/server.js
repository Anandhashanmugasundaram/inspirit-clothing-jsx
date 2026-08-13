const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

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
      // Allow requests without Origin
      // such as Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  })
);

// Explicit OPTIONS handling
app.options("*", cors());

// ==========================
// BODY PARSER
// ==========================

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// ==========================
// LOGGER
// ==========================

app.use((req, res, next) => {
  console.log(
    `[API] ${req.method} ${req.originalUrl}`,
    "Origin:",
    req.headers.origin
  );

  next();
});

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "INSPIRIT API Server Running",
  });
});

// ==========================
// ROUTES
// ==========================

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// ==========================
// ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

module.exports = app;