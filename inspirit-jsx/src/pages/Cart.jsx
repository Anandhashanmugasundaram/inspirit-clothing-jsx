import { Link } from "react-router-dom";
import { useState } from "react";

import {
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

import { useApp } from "@/context/AppContext";

import toast from "react-hot-toast";

function Cart() {
  const {
    cart = [],
    removeFromCart,
    updateQty,
    cartTotal = 0,
    cartLoading,
    discount = 0,
    setDiscount,
  } = useApp();

  const [coupon, setCoupon] = useState("");

  // ======================
  // SHIPPING
  // ======================
  const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 20;

  const total = Math.max(0, cartTotal - discount) + shipping;

  // ======================
  // APPLY COUPON
  // ======================
  const applyCoupon = (e) => {
    e.preventDefault();

    if (coupon.toUpperCase() === "RITUAL10") {
      setDiscount(50);
      toast.success("₹50 discount applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  // ======================
  // QTY UPDATE
  // ✅ Reads item.stock (now always present from addToCart fix)
  // ======================
  const increaseQty = (item) => {
    const maxQty = item?.stock ?? 99;

    if (item.qty >= maxQty) {
      toast.error(
        `Only ${maxQty} items available in size ${item.size || ""}`
      );
      return;
    }

    updateQty(item._id, item.qty + 1);
  };

  const decreaseQty = (item) => {
    if (item.qty <= 1) return;
    updateQty(item._id, item.qty - 1);
  };

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8">

        {/* HEADING */}
        <div className="mb-8 md:mb-10">
          <p className="uppercase tracking-[0.3em] md:tracking-[0.35em] text-[11px] md:text-sm text-red-700 font-medium">
            Your Cart
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-2 md:mt-3 leading-none">
            Shopping Bag
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-500">
            Review your items before checkout.
          </p>
        </div>

        {/* LOADING */}
        {cartLoading ? (
          <div className="flex items-center justify-center py-32 md:py-40">
            <div className="w-12 h-12 md:w-14 md:h-14 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>

        ) : cart.length === 0 ? (

          /* EMPTY CART */
          <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-14 text-center shadow-sm border">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black text-white flex items-center justify-center mx-auto">
              <FiShoppingBag size={26} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mt-5 md:mt-6">
              Your cart is empty
            </h2>

            <p className="text-sm md:text-base text-gray-500 mt-2">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 md:mt-8 bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:opacity-90 transition text-sm md:text-base"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>

        ) : (

          /* CART CONTENT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

            {/* LEFT — CART ITEMS */}
            <div className="lg:col-span-2 space-y-4 md:space-y-5">
              {cart.map((item, index) => {
                const image =
                  item?.images?.[0]?.url ||
                  item?.image ||
                  "/placeholder.png";

                const maxQty = item?.stock ?? 99;
                const atMax = item.qty >= maxQty;

                return (
                  <div
                    key={item?._id || index}
                    className="bg-white rounded-2xl md:rounded-3xl border p-3 sm:p-4 md:p-5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-5">

                      {/* IMAGE */}
                      <div className="w-full sm:w-36 md:w-44 h-56 sm:h-44 md:h-52 overflow-hidden rounded-2xl bg-gray-100 flex-shrink-0">
                        <img
                          src={image}
                          alt={item?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>

                          {/* TOP ROW */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">

                              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] text-gray-400">
                                {item?.category || "Fashion"}
                              </p>

                              <Link
                                to={`/product/${item?.productId || item?._id}`}
                                className="block text-lg sm:text-xl md:text-2xl font-bold hover:text-red-700 transition leading-tight break-words"
                              >
                                {item?.name}
                              </Link>

                              {/* SIZE + STOCK */}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {item?.size && (
                                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold tracking-widest">
                                    SIZE: {item.size}
                                  </span>
                                )}

                                {item?.stock !== undefined && (
                                  <span
                                    className={`text-xs font-medium ${
                                      atMax
                                        ? "text-red-500 font-bold"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {atMax
                                      ? "Max stock reached"
                                      : `${maxQty} available`}
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-gray-500 text-xs sm:text-sm line-clamp-2 md:line-clamp-3">
                                {item?.description?.slice(0, 120)}
                              </p>
                            </div>

                            {/* REMOVE */}
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>

                          {/* QTY + PRICE */}
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-5 md:mt-6">

                            {/* QTY */}
                            <div className="flex items-center border rounded-xl overflow-hidden">
                              <button
                                onClick={() => decreaseQty(item)}
                                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition"
                              >
                                <FiMinus />
                              </button>

                              <div className="w-10 md:w-12 text-center font-semibold text-sm">
                                {item?.qty || 1}
                              </div>

                              <button
                                onClick={() => increaseQty(item)}
                                disabled={atMax}
                                className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition ${
                                  atMax
                                    ? "opacity-30 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <FiPlus />
                              </button>
                            </div>

                            {/* UNIT PRICE */}
                            <div className="px-3 md:px-4 py-2 rounded-xl bg-gray-100 text-sm">
                              ₹{item?.price || 0}
                            </div>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="mt-5 md:mt-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-400">
                              Item Total
                            </p>

                            <h3 className="text-2xl md:text-3xl font-black">
                              ₹{((item?.price || 0) * (item?.qty || 1)).toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <aside className="bg-white border rounded-2xl md:rounded-3xl p-5 md:p-7 h-fit lg:sticky lg:top-28 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-black">
                Order Summary
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                Review your order before payment.
              </p>

              {/* COUPON */}
              <form
                onSubmit={applyCoupon}
                className="mt-6 md:mt-7 flex flex-col sm:flex-row gap-2"
              >
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm"
                />

                <button className="bg-red-700 text-white px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap">
                  Apply
                </button>
              </form>

              {/* SUMMARY ROWS */}
              <div className="mt-7 md:mt-8 space-y-4">
                <div className="flex justify-between text-sm md:text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm md:text-base text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm md:text-base text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between text-xl md:text-2xl font-black">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* CHECKOUT */}
              <Link
                to="/checkout"
                className="mt-7 md:mt-8 w-full bg-black text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold hover:bg-gray-900 transition text-sm md:text-base"
              >
                Proceed To Checkout
                <FiArrowRight />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;