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

// MIDDLEWARE
app.use(cors());

app.use(express.json());

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Server Running");
});

// CART ROUTE
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
