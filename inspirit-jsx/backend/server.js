const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// CONNECT DATABASE
connectDB();

// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin: [
      "https://inspiritclothings.in",
      "https://www.inspiritclothings.in",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================
// BODY PARSER
// ==========================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ==========================
// REQUEST LOGGER
// ==========================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ==========================
// HOME ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Server Running");
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
    message: err.message || "Something went wrong",
  });
});

// ==========================
// PORT
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});