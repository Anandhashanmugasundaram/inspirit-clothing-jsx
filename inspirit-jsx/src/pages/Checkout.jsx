import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios";

import { FiCheck } from "react-icons/fi";

import { useApp } from "@/context/AppContext";

import toast from "react-hot-toast";

function Checkout() {
  const { user, cart = [], cartTotal = 0, clearCart } = useApp();

  const [done, setDone] = useState(false);

  const nav = useNavigate();

 const API = import.meta.env.VITE_API_URL || "https://inspirit-clothing-jsx.onrender.com";

  // ======================
  // SHIPPING
  // ======================
  const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 20;

  const total = cartTotal + shipping;

  // ======================
  // SUBMIT ORDER
  // ======================
const submit = async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  const orderData = {
    userEmail: user.email,

    customer: {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: user.email,
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      postalCode: form.get("postalCode"),
      country: form.get("country"),
    },

    items: cart.map((item) => ({
      productId: item.productId || item._id || item?.product?._id,
      name: item.name || item?.product?.name,
      image:
        item.image ||
        item?.product?.image ||
        item?.product?.images?.[0]?.url ||
        "/placeholder.png",
      price: item.price || item?.product?.price || 0,
      qty: item.qty || 1,
      total: (item.price || item?.product?.price || 0) * (item.qty || 1),
    })),

    subtotal: cartTotal,
    shipping,
    total,
    status: "Pending",
  };

  await axios.post(`${API}/api/orders`, orderData);

  await clearCart();
  setDone(true);

  toast.success("Order placed successfully");

  setTimeout(() => nav("/account"), 4000);
};

  // ======================
  // SUCCESS PAGE
  // ======================
  if (done) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto h-24 w-24 rounded-full bg-black text-white flex items-center justify-center">
            <FiCheck className="text-4xl" />
          </div>

          <h1 className="mt-8 text-5xl font-black">Order Confirmed</h1>

          <p className="mt-4 text-gray-500">
            Your order has been received successfully.
          </p>

          <Link
            to="/account"
            className="mt-8 inline-block font-medium underline underline-offset-4"
          >
            VIEW ORDERS →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* HEADING */}
        <div className="mb-10">
          <p className="uppercase tracking-[0.35em] text-sm text-red-700 font-medium">
            Checkout
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-10">
            {/* CONTACT */}
            <section>
              <h3 className="text-sm tracking-[0.3em] mb-5 font-semibold">
                CONTACT
              </h3>

              <input
                required
                type="email"
                defaultValue={user?.email}
                placeholder="Email address"
                className="w-full px-4 py-4 border rounded-xl outline-none focus:border-black"
              />
            </section>

            {/* SHIPPING */}
            <section>
              <h3 className="text-sm tracking-[0.3em] mb-5 font-semibold">
                SHIPPING
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  name="firstName" 
                  placeholder="First name"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <input
                  required
                  name="lastName"
                  placeholder="Last name"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                 <input
                  required
                  name="phone" 
                  placeholder="Phone number"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <input
                  required
                  name="address"
                  placeholder="Address"
                  className="md:col-span-2 px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <input
                  required
                  name="city"

                  placeholder="City"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <input
                  required
                  name="postalCode" 
                  placeholder="Postal code"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <input
                  required
                  name="country"
                  placeholder="Country"
                  className="md:col-span-2 px-4 py-4 border rounded-xl outline-none focus:border-black"
                />
              </div>
            </section>

            {/* PAYMENT */}
            <section>
              <h3 className="text-sm tracking-[0.3em] mb-5 font-semibold">
                PAYMENT
              </h3>

              <div className="space-y-4">
                <input
                  required
                  placeholder="Card number"
                  className="w-full px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="MM / YY"
                    className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                  />

                  <input
                    required
                    placeholder="CVC"
                    className="px-4 py-4 border rounded-xl outline-none focus:border-black"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <aside className="bg-white border rounded-3xl p-7 h-fit sticky top-28 shadow-sm">
            <h3 className="text-3xl font-black">Order Summary</h3>

            {/* PRODUCTS */}
            <div className="mt-6 space-y-4 max-h-96 overflow-auto">
              {cart.map((item, index) => {
                const product = item?.product || item;

                if (!product) return null;

                return (
                  <div
                    key={`${product?._id || product?.id || index}`}
                    className="flex gap-4 border-b pb-4"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        product?.images?.[0]?.url ||
                        product?.image ||
                        "/placeholder.png"
                      }
                      alt={product?.name}
                      className="h-20 w-16 rounded-xl object-cover bg-gray-100"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-1">
                        {product?.name || "Unknown Product"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item?.qty || 1}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{product?.price || 0}
                      </p>
                    </div>

                    {/* TOTAL */}
                    <div className="font-semibold">
                      ₹{((product?.price || 0) * (item?.qty || 1)).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PRICE */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between pt-4 border-t text-2xl font-black">
                <span>Total</span>

                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="mt-8 w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition">
              CONFIRM ORDER
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure payments • Fast delivery
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
