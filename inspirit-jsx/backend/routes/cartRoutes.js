const express = require("express");

const router = express.Router();

const {
  getCartItems,
  addToCart,
  deleteCartItem,
} = require("../controllers/cartController");


// GET CART
router.get("/", getCartItems);


// ADD TO CART
router.post("/", addToCart);


// DELETE ITEM
router.delete("/:id", deleteCartItem);


module.exports = router;