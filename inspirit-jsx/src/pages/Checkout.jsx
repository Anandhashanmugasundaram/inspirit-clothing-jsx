import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import axios from "axios";

import { FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { useApp } from "@/context/AppContext";

import toast from "react-hot-toast";

import validator from "validator";

import { parsePhoneNumberFromString } from "libphonenumber-js";

import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";

// ⚠️ NOTE: We intentionally do NOT statically import { Country, State, City }
// from "country-state-city" at the top of this file anymore.
//
// That package loads the FULL world dataset into memory on import —
// including every city on earth (100,000+ entries). Desktop browsers don't
// care, but iOS Safari has much tighter per-tab memory limits and will
// silently kill the tab (blank white screen, no JS error, no console output)
// when memory pressure gets too high. That is almost certainly what was
// happening on your checkout page.
//
// Fix applied here:
//   1. City dropdown removed entirely — replaced with a plain text input.
//      (City list was the single biggest memory cost by far.)
//   2. Country/State data is now lazy-loaded via dynamic import() inside
//      a useEffect, so it only loads once the user actually reaches
//      checkout instead of being bundled into the initial page memory.

function Checkout() {
  console.log("[Checkout] ---- render start ----");

  let appCtx;
  try {
    appCtx = useApp();
    console.log("[Checkout] useApp() resolved OK", {
      hasUser: !!appCtx?.user,
      cartLength: appCtx?.cart?.length,
      cartTotal: appCtx?.cartTotal,
    });
  } catch (err) {
    console.error("[Checkout] useApp() THREW — AppProvider likely missing/crashed", err);
    throw err;
  }

  const { user, cart = [], cartTotal = 0, clearCart, discount = 0 } = appCtx;

  const [done, setDone] = useState(false);

  const [phone, setPhone] = useState("");

  const [country, setCountry] = useState("IN");

  const [stateCode, setStateCode] = useState("TN");
  const [city, setCity] = useState("Chennai");

  // Stores the pending order data while waiting for WhatsApp confirmation
  const [pendingOrder, setPendingOrder] = useState(null);

  // Shows the "Did you send?" confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  // Lazy-loaded country-state-city module + data
  const [csc, setCsc] = useState(null); // the module itself (Country, State)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [locationLoading, setLocationLoading] = useState(true);

  const nav = useNavigate();

  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx-oi4h.vercel.app";

  console.log("[Checkout] state initialized", { country, stateCode, city, phone });

  // ✅ Dynamically import country-state-city ONLY when Checkout mounts,
  // instead of at app bundle load time. Also: we never touch `City` at all
  // anymore, which avoids loading the huge cities dataset entirely.
  useEffect(() => {
    let cancelled = false;
    console.log("[Checkout] dynamically importing country-state-city");
    import("country-state-city")
      .then((mod) => {
        if (cancelled) return;
        console.log("[Checkout] country-state-city loaded OK");
        setCsc(mod);
        try {
          const allCountries = mod.Country.getAllCountries();
          console.log("[Checkout] countries computed OK, count =", allCountries?.length);
          setCountries(allCountries);
        } catch (err) {
          console.error("[Checkout] Country.getAllCountries() THREW", err);
        }
      })
      .catch((err) => {
        console.error("[Checkout] Failed to load country-state-city", err);
        toast.error("Failed to load location data. Please refresh.");
      })
      .finally(() => {
        if (!cancelled) setLocationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Recompute states whenever country or the loaded module changes
  useEffect(() => {
    if (!csc) return;
    console.log("[Checkout] computing states list for country =", country);
    try {
      const result = csc.State.getStatesOfCountry(country);
      console.log("[Checkout] states computed OK, count =", result?.length);
      setStates(result || []);
    } catch (err) {
      console.error("[Checkout] State.getStatesOfCountry() THREW", err);
      setStates([]);
    }
  }, [csc, country]);

  const shipping = cartTotal > 250 || cartTotal === 0 ? 0 : 20;
  const total = Math.max(0, cartTotal - discount) + shipping;

  console.log("[Checkout] derived totals", { shipping, total });

  useEffect(() => {
    console.log("[Checkout] mounted");
    return () => console.log("[Checkout] unmounting");
  }, []);

  useEffect(() => {
    console.log("[Checkout] cart changed, length =", cart.length);
  }, [cart]);

  // ======================
  // STEP 1 — VALIDATE + OPEN WHATSAPP
  // Order is NOT saved yet
  // ======================
  const submit = async (e) => {
    e.preventDefault();
    console.log("[Checkout] submit() fired");

    try {
      const form = new FormData(e.target);

      const firstName = form.get("firstName")?.trim();
      const lastName = form.get("lastName")?.trim();
      const cityValue = form.get("city")?.trim();
      const state = form.get("state")?.trim();
      const postalCode = form.get("postalCode")?.trim();
      const countryCode = form.get("country");
      const address = form.get("address")?.trim();

      console.log("[Checkout] raw form values", {
        firstName,
        lastName,
        cityValue,
        state,
        postalCode,
        countryCode,
        address,
      });

      const selectedCountry = countries.find((c) => c.isoCode === countryCode);
      const selectedState = states.find((s) => s.isoCode === state);
      const countryName = selectedCountry?.name || countryCode;
      const stateName = selectedState?.name || state;

      console.log("[Checkout] resolved names", { countryName, stateName });

      // VALIDATION
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(firstName)) {
        console.warn("[Checkout] validation failed: firstName", firstName);
        return toast.error("Invalid first name");
      }
      if (!nameRegex.test(lastName)) {
        console.warn("[Checkout] validation failed: lastName", lastName);
        return toast.error("Invalid last name");
      }
      if (!cityValue) {
        console.warn("[Checkout] validation failed: city missing");
        return toast.error("Enter city");
      }
      if (!state) {
        console.warn("[Checkout] validation failed: state missing");
        return toast.error("Select state");
      }
      if (
        address.length < 10 ||
        !/[a-zA-Z]/.test(address) ||
        !/[0-9]/.test(address)
      ) {
        console.warn("[Checkout] validation failed: address", address);
        return toast.error("Enter valid address");
      }

      const phoneNumber = parsePhoneNumberFromString(phone);
      console.log("[Checkout] phone validation", {
        phone,
        valid: phoneNumber?.isValid(),
      });
      if (!phoneNumber?.isValid()) {
        console.warn("[Checkout] validation failed: phone");
        return toast.error("Invalid phone number");
      }

      const postalValid = validator.isPostalCode(postalCode, countryCode);
      console.log("[Checkout] postal code validation", { postalCode, countryCode, postalValid });
      if (!postalValid) {
        console.warn("[Checkout] validation failed: postalCode");
        return toast.error("Invalid postal code");
      }

      if (cart.length === 0) {
        console.warn("[Checkout] validation failed: cart empty");
        return toast.error("Cart is empty");
      }

      // ✅ STOCK VALIDATION — check before opening WhatsApp
      for (const item of cart) {
        const product = item?.product || item;
        const productName = product?.name || "A product";
        const size = item?.size || product?.size || "N/A";
        const qty = item?.qty || 1;

        // Support both `stock` and `quantity` field names
        // ✅ CORRECT — total available = stock remaining + qty already reserved by this user
        const reservedQty = item?.qty || 1;
        const remainingStock = product?.stock ?? product?.quantity ?? null;
        const totalAvailable =
          remainingStock !== null ? remainingStock + reservedQty : null;

        console.log("[Checkout] stock check", {
          productName,
          size,
          qty,
          remainingStock,
          totalAvailable,
        });

        if (totalAvailable !== null && totalAvailable < reservedQty) {
          console.warn("[Checkout] stock check FAILED", productName);
          return toast.error(
            `"${productName}" (${size}) is out of stock. Please remove it from your cart.`
          );
        }
      }

      // BUILD ORDER DATA (not saved yet)
      const orderData = {
        userEmail: user.email,
        customer: {
          firstName,
          lastName,
          email: user.email,
          phone,
          address,
          city: cityValue,
          state: stateName,
          postalCode,
          country: countryName,
        },
        items: cart.map((item) => ({
          productId: item.productId || item._id || item?.product?._id,
          name: item.name || item?.product?.name,
          size: item?.size || item?.product?.size || "N/A",
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
        discount,
        total,
        status: "Pending",
      };

      console.log("[Checkout] orderData built", orderData);

      // BUILD WHATSAPP MESSAGE
      const productsText = cart
        .map((item, index) => {
          const product = item?.product || item;
          const image =
            product?.images?.[0]?.url || product?.image || "/placeholder.png";
          return `
${index + 1}. ${product?.name}
📏 Size: ${item?.size || product?.size || "N/A"}
🔢 Qty: ${item?.qty || 1}
💵 Price: ₹${product?.price || 0}
🧾 Total: ₹${(product?.price || 0) * (item?.qty || 1)}
🖼 Product Image:
${image}`;
        })
        .join("\n");

      const message = `
🛍️ *NEW ORDER — INSPIRIT CLOTHING*

👤 *Customer Details*
Name: ${firstName} ${lastName}
Email: ${user?.email}
Phone: ${phone}

📍 *Shipping Address*
${address}
${cityValue}, ${stateName}
${countryName} - ${postalCode}

📦 *Order Items*
${productsText}

💰 *Order Summary*
Subtotal: ₹${cartTotal.toFixed(2)}
Shipping: ₹${shipping}
Total: ₹${total.toFixed(2)}
`;

      const whatsappNumber = "919940404491";
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      console.log("[Checkout] whatsappURL length", whatsappURL.length);

      // Save pending order data in state (not in DB yet)
      setPendingOrder(orderData);
      console.log("[Checkout] pendingOrder set");

      // Open WhatsApp
      console.log("[Checkout] calling window.open for WhatsApp");
      const opened = window.open(whatsappURL, "_blank");
      console.log("[Checkout] window.open returned", opened, "(null/undefined often means popup was blocked)");

      // Show confirmation dialog
      setShowConfirm(true);
      console.log("[Checkout] showConfirm set true");
    } catch (err) {
      console.error("[Checkout] submit() THREW an uncaught error", err);
      toast.error("Something went wrong. Check the console for details.");
    }
  };

  // ======================
  // STEP 2A — USER CONFIRMS SENT
  // Now save the order
  // ======================
  const handleConfirmSent = async () => {
    console.log("[Checkout] handleConfirmSent() fired", pendingOrder);
    if (!pendingOrder) {
      console.warn("[Checkout] handleConfirmSent called with no pendingOrder");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(`${API}/api/orders`, pendingOrder);
      console.log("[Checkout] order POST success", res.data);

      await clearCart();
      console.log("[Checkout] cart cleared");

      setShowConfirm(false);
      setPendingOrder(null);
      setDone(true);

      toast.success("Order placed successfully");

      setTimeout(() => nav("/account"), 4000);
    } catch (error) {
      console.error("[Checkout] order POST FAILED", error);
      toast.error(
        error?.response?.data?.message || "Failed to place order"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // STEP 2B — USER CANCELS / DID NOT SEND
  // Discard order, keep cart intact
  // ======================
  const handleCancelOrder = () => {
    console.log("[Checkout] handleCancelOrder() fired");
    setShowConfirm(false);
    setPendingOrder(null);
    toast("Order cancelled. Your cart is still saved.");
  };

  // Helper: get stock for a cart item
  const getStock = (item) => {
    const product = item?.product || item;
    return product?.stock ?? product?.quantity ?? null;
  };

  // ======================
  // SUCCESS PAGE
  // ======================
  if (done) {
    console.log("[Checkout] rendering SUCCESS page");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto h-20 w-20 md:h-24 md:w-24 rounded-full bg-black text-white flex items-center justify-center">
            <FiCheck className="text-3xl md:text-4xl" />
          </div>
          <h1 className="mt-6 md:mt-8 text-3xl md:text-5xl font-black">
            Order Confirmed
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-500">
            Your order has been received successfully.
          </p>
          <Link
            to="/account"
            className="mt-8 inline-block font-medium underline underline-offset-4 text-sm md:text-base"
          >
            VIEW ORDERS →
          </Link>
        </div>
      </div>
    );
  }

  console.log("[Checkout] rendering MAIN checkout form");

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-10">

        {/* HEADING */}
        <div className="mb-8 md:mb-10">
          <p className="uppercase tracking-[0.3em] md:tracking-[0.35em] text-[11px] md:text-sm text-red-700 font-medium">
            Checkout
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-2 md:mt-3 leading-none">
            Complete Your Order
          </h1>
        </div>

        {/* WHATSAPP CONFIRMATION DIALOG */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <FaWhatsapp className="text-green-500 text-3xl" />
              </div>

              <h2 className="text-2xl font-black mt-5">
                Did you send the message?
              </h2>

              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                Your order will only be confirmed after you send the WhatsApp
                message to us. If you closed WhatsApp without sending, tap{" "}
                <strong>Cancel</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleConfirmSent}
                  disabled={saving}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-semibold text-sm hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {saving ? "Placing order..." : "✅ Yes, I sent it"}
                </button>

                <button
                  onClick={handleCancelOrder}
                  disabled={saving}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
                >
                  ✕ Cancel
                </button>
              </div>

              {/* Resend button */}
              <button
                onClick={() => {
                  console.log("[Checkout] Reopen WhatsApp clicked", pendingOrder);
                  if (pendingOrder) {
                    try {
                      const cart_ = cart;
                      const productsText = cart_
                        .map((item, index) => {
                          const product = item?.product || item;
                          const image =
                            product?.images?.[0]?.url || product?.image || "";
                          return `\n${index + 1}. ${product?.name}\n📏 Size: ${item?.size || "N/A"}\n🔢 Qty: ${item?.qty || 1}\n💵 Price: ₹${product?.price || 0}\n🧾 Total: ₹${(product?.price || 0) * (item?.qty || 1)}\n🖼 ${image}`;
                        })
                        .join("\n");

                      const c = pendingOrder.customer;
                      const message = `🛍 *NEW ORDER — INSPIRIT CLOTHING*\n\n👤 *Customer Details*\nName: ${c.firstName} ${c.lastName}\nEmail: ${c.email}\nPhone: ${c.phone}\n\n📍 *Shipping Address*\n${c.address}\n${c.city}, ${c.state}\n${c.country} - ${c.postalCode}\n\n📦 *Order Items*\n${productsText}\n\n💰 *Order Summary*\nSubtotal: ₹${pendingOrder.subtotal.toFixed(2)}\nShipping: ₹${pendingOrder.shipping}\nTotal: ₹${pendingOrder.total.toFixed(2)}`;

                      const opened = window.open(
                        `https://wa.me/917397284491?text=${encodeURIComponent(message)}`,
                        "_blank"
                      );
                      console.log("[Checkout] Reopen WhatsApp window.open returned", opened);
                    } catch (err) {
                      console.error("[Checkout] Reopen WhatsApp THREW", err);
                    }
                  }
                }}
                className="mt-4 text-sm text-gray-400 hover:text-black underline underline-offset-4 transition"
              >
                Reopen WhatsApp
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={submit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {/* CONTACT */}
            <section>
              <h3 className="text-[11px] md:text-sm tracking-[0.25em] md:tracking-[0.3em] mb-4 md:mb-5 font-semibold">
                CONTACT
              </h3>
              <input
                required
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full px-4 py-3 md:py-4 border rounded-xl outline-none bg-gray-100 text-sm md:text-base"
              />
            </section>

            {/* SHIPPING */}
            <section>
              <h3 className="text-[11px] md:text-sm tracking-[0.25em] md:tracking-[0.3em] mb-4 md:mb-5 font-semibold">
                SHIPPING
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input
                  required
                  name="firstName"
                  placeholder="First name"
                  className="px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black text-sm md:text-base"
                />
                <input
                  required
                  name="lastName"
                  placeholder="Last name"
                  className="px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black text-sm md:text-base"
                />

                {/* PHONE */}
                <div className="md:col-span-2">
                  <PhoneInput
                    international
                    defaultCountry={country}
                    value={phone}
                    onChange={(val) => {
                      console.log("[Checkout] PhoneInput onChange", val);
                      setPhone(val);
                    }}
                    placeholder="Enter phone number"
                    className="border rounded-xl px-4 py-3 md:py-4 text-sm md:text-base"
                  />
                </div>

                {/* ADDRESS */}
                <input
                  required
                  name="address"
                  placeholder="Address"
                  className="md:col-span-2 px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black text-sm md:text-base"
                />

                {/* COUNTRY */}
                <select
                  required
                  name="country"
                  value={country}
                  disabled={locationLoading}
                  onChange={(e) => {
                    console.log("[Checkout] country changed ->", e.target.value);
                    setCountry(e.target.value);
                    setStateCode("");
                  }}
                  className="md:col-span-2 px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black bg-white text-sm md:text-base disabled:opacity-50"
                >
                  <option value="">
                    {locationLoading ? "Loading countries..." : "Select Country"}
                  </option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* STATE */}
                <select
                  required
                  name="state"
                  value={stateCode}
                  disabled={locationLoading}
                  onChange={(e) => {
                    console.log("[Checkout] state changed ->", e.target.value);
                    setStateCode(e.target.value);
                  }}
                  className="px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black bg-white text-sm md:text-base disabled:opacity-50"
                >
                  <option value="">
                    {locationLoading ? "Loading states..." : "Select State"}
                  </option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* CITY — plain text input now (no more City dataset load) */}
                <input
                  required
                  name="city"
                  placeholder="City"
                  defaultValue={city}
                  onChange={(e) => {
                    console.log("[Checkout] city changed ->", e.target.value);
                    setCity(e.target.value);
                  }}
                  className="px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black text-sm md:text-base"
                />

                {/* POSTAL */}
                <input
                  required
                  name="postalCode"
                  placeholder="Postal code"
                  className="md:col-span-2 px-4 py-3 md:py-4 border rounded-xl outline-none focus:border-black text-sm md:text-base"
                />
              </div>
            </section>

            {/* BUTTON */}
            <button
              type="submit"
              className="mt-4 md:mt-8 w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3 text-sm md:text-base"
            >
              <FaWhatsapp className="text-xl md:text-2xl text-green-400" />
              ORDER VIA WHATSAPP
            </button>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <aside className="bg-white border rounded-2xl md:rounded-3xl p-5 md:p-7 h-fit lg:sticky lg:top-28 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-black">Order Summary</h3>

            <div className="mt-5 md:mt-6 space-y-4 max-h-80 md:max-h-96 overflow-auto">
              {cart.map((item, index) => {
                const product = item?.product || item;
                if (!product) return null;

                const stock = getStock(item);
                const qty = item?.qty || 1;
                const outOfStock = stock !== null && stock <= 0;
                const lowStock = stock !== null && stock > 0 && stock < qty;

                return (
                  <div
                    key={product?._id || index}
                    className="flex gap-3 md:gap-4 border-b pb-4"
                  >
                    <img
                      src={
                        product?.images?.[0]?.url ||
                        product?.image ||
                        "/placeholder.png"
                      }
                      alt={product?.name}
                      className="h-20 w-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base line-clamp-2 break-words">
                        {product?.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Size: {item?.size || product?.size || "N/A"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        Qty: {qty}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        ₹{product?.price || 0}
                      </p>

                      {/* ✅ Stock warnings */}
                      {outOfStock && (
                        <p className="text-xs text-red-500 font-semibold mt-1">
                          ❌ Out of stock — remove from cart
                        </p>
                      )}
                      {lowStock && (
                        <p className="text-xs text-orange-500 font-semibold mt-1">
                          ⚠️ Only {stock} left — update qty
                        </p>
                      )}
                    </div>
                    <div className="font-semibold text-sm md:text-base whitespace-nowrap">
                      ₹{((product?.price || 0) * qty).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between pt-4 border-t text-xl md:text-2xl font-black">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] md:text-xs text-gray-400 text-center mt-4">
              Secure payments • Fast delivery
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;