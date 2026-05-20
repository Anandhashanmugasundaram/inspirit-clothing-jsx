import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

function Cart() {
  const {
    cart = [],
    removeFromCart,
    cartTotal = 0,
  } = useApp();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping =
    cartTotal > 250 || cartTotal === 0 ? 0 : 20;

  const total =
    Math.max(0, cartTotal - discount) + shipping;

  const applyCoupon = (e) => {
    e.preventDefault();

    if (coupon.toUpperCase() === "RITUAL10") {
      setDiscount(cartTotal * 0.1);
      toast.success("10% discount applied");
    } else {
      toast.error("Invalid promo code");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADING */}
        <div className="mb-10">
          <p className="uppercase tracking-[0.35em] text-sm text-red-700 font-medium">
            Your Cart
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Shopping Bag
          </h1>

          <p className="mt-3 text-gray-500">
            Review your items before checkout.
          </p>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mx-auto">
              <FiShoppingBag size={30} />
            </div>

            <h2 className="text-3xl font-bold mt-6">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-8 bg-black text-white px-8 py-4 rounded-xl hover:opacity-90 transition"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item, index) => {
                const product = item?.product || item;

                if (!product) return null;

                return (
                  <div
                    key={`${product?._id || product?.id || index}`}
                    className="bg-white rounded-3xl border p-5 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* IMAGE */}
                      <div className="w-full md:w-44 h-52 overflow-hidden rounded-2xl bg-gray-100">
                        <img
                          src={
                            product?.images?.[0] ||
                            product?.image ||
                            "https://placehold.co/600x800?text=Product"
                          }
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-5">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                {product?.category || "Fashion"}
                              </p>

                              <Link
                                to={`/product/${product?.slug || product?._id}`}
                                className="text-2xl font-bold hover:text-red-700 transition"
                              >
                                {product?.name || "Product"}
                              </Link>

                              <p className="mt-2 text-gray-500 text-sm">
                                {product?.description?.slice(0, 120) ||
                                  "Premium quality product."}
                              </p>
                            </div>

                            {/* REMOVE */}
                            <button
                              onClick={() =>
                                removeFromCart(
                                  product?._id || product?.id
                                )
                              }
                              className="text-gray-400 hover:text-red-600 transition"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>

                          {/* INFO */}
                          <div className="flex flex-wrap gap-4 mt-5">
                            <div className="px-4 py-2 rounded-xl bg-gray-100 text-sm">
                              Quantity:{" "}
                              <span className="font-semibold">
                                {item?.qty || 1}
                              </span>
                            </div>

                            <div className="px-4 py-2 rounded-xl bg-gray-100 text-sm">
                              Price:{" "}
                              <span className="font-semibold">
                                ${product?.price || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* TOTAL */}
                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">
                              Item Total
                            </p>

                            <h3 className="text-3xl font-black">
                              $
                              {(
                                (product?.price || 0) *
                                (item?.qty || 1)
                              ).toFixed(2)}
                            </h3>
                          </div>

                     
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE */}
            <aside className="bg-white border rounded-3xl p-7 h-fit sticky top-28 shadow-sm">
              <h2 className="text-3xl font-black">
                Order Summary
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                Review your order before payment.
              </p>

              {/* COUPON */}
              <form
                onSubmit={applyCoupon}
                className="mt-7 flex gap-2"
              >
                <input
                  value={coupon}
                  onChange={(e) =>
                    setCoupon(e.target.value)
                  }
                  placeholder="Promo code"
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                />

                <button className="bg-red-700 text-white px-5 rounded-xl font-medium hover:bg-red-800 transition">
                  Apply
                </button>
              </form>

              {/* SUMMARY */}
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>

                    <span>
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `$${shipping}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between text-2xl font-black">
                  <span>Total</span>

                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-4">
                  Items You’re Ordering
                </h3>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item, index) => {
                    const product = item?.product || item;

                    return (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <img
                          src={
                            product?.images?.[0] ||
                            product?.image ||
                            "https://placehold.co/200x250"
                          }
                          alt={product?.name}
                          className="w-16 h-20 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {product?.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item?.qty || 1}
                          </p>
                        </div>

                        <p className="text-sm font-semibold">
                          $
                          {(
                            (product?.price || 0) *
                            (item?.qty || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CHECKOUT */}
              <Link
                to="/checkout"
                className="mt-8 w-full bg-black hover:bg-gray-900 text-white transition rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold"
              >
                Proceed To Checkout
                <FiArrowRight />
              </Link>

              <p className="text-xs text-gray-400 text-center mt-4">
                Secure payments • Fast delivery • Easy returns
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;