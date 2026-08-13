const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ======================
// CORS
// ======================
app.use(
  cors({
    origin: [
      "https://inspiritclothings.in",
      "https://www.inspiritclothings.in",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// ======================
// BODY PARSER
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// DATABASE
// ======================
connectDB();

// ======================
// ROUTES
// ======================
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "INSPIRIT API is running",
  });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;