const Cart = require("../models/Cart");


// GET CART
const getCartItems = async (req, res) => {

  try {

    const items = await Cart.find();

    res.json(items);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ADD TO CART
const addToCart = async (req, res) => {

  try {

    const item = new Cart(req.body);

    await item.save();

    res.status(201).json({
      success: true,
      message: "Added To Cart",
      data: item,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE ITEM
const deleteCartItem = async (req, res) => {

  try {

    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  getCartItems,
  addToCart,
  deleteCartItem,
};