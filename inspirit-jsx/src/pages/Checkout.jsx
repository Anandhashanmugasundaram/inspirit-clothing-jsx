import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios";

import { FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { useApp } from "@/context/AppContext";

import toast from "react-hot-toast";

import validator from "validator";

import { parsePhoneNumberFromString } from "libphonenumber-js";

import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";

import { Country, State, City } from "country-state-city";

function Checkout() {
  const { user, cart = [], cartTotal = 0, clearCart } = useApp();

  const [done, setDone] = useState(false);

  const [phone, setPhone] = useState("");

  const [country, setCountry] = useState("IN");

  const [stateCode, setStateCode] = useState("");

  const nav = useNavigate();

  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx.onrender.com";

  // ======================
  // COUNTRY / STATE / CITY
  // ======================
  const countries = Country.getAllCountries();

  const states = State.getStatesOfCountry(country);

  const cities = City.getCitiesOfState(country, stateCode);

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

    // ======================
    // FORM VALUES
    // ======================
    const firstName = form.get("firstName")?.trim();

    const lastName = form.get("lastName")?.trim();

    const city = form.get("city")?.trim();

    const state = form.get("state")?.trim();

    const postalCode = form.get("postalCode")?.trim();

    const countryCode = form.get("country");

    const address = form.get("address")?.trim();

    // ======================
    // COUNTRY / STATE NAMES
    // ======================
    const selectedCountry = countries.find(
      (c) => c.isoCode === countryCode
    );

    const selectedState = states.find(
      (s) => s.isoCode === state
    );

    const countryName = selectedCountry?.name || countryCode;

    const stateName = selectedState?.name || state;

    // ======================
    // VALIDATION
    // ======================
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(firstName)) {
      return toast.error("Invalid first name");
    }

    if (!nameRegex.test(lastName)) {
      return toast.error("Invalid last name");
    }

    if (!city) {
      return toast.error("Select city");
    }

    if (!state) {
      return toast.error("Select state");
    }

    if (
      address.length < 10 ||
      !/[a-zA-Z]/.test(address) ||
      !/[0-9]/.test(address)
    ) {
      return toast.error("Enter valid address");
    }

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber?.isValid()) {
      return toast.error("Invalid phone number");
    }

    if (!validator.isPostalCode(postalCode, countryCode)) {
      return toast.error("Invalid postal code");
    }

    if (cart.length === 0) {
      return toast.error("Cart is empty");
    }

    // ======================
    // ORDER DATA
    // ======================
    const orderData = {
      userEmail: user.email,

      customer: {
        firstName,
        lastName,
        email: user.email,
        phone,
        address,
        city,
        state: stateName,
        postalCode,
        country: countryName,
      },

      items: cart.map((item) => ({
        productId:
          item.productId ||
          item._id ||
          item?.product?._id,

        name:
          item.name ||
          item?.product?.name,

        size:
          item?.size ||
          item?.product?.size ||
          "N/A",

        image:
          item.image ||
          item?.product?.image ||
          item?.product?.images?.[0]?.url ||
          "/placeholder.png",

        price:
          item.price ||
          item?.product?.price ||
          0,

        qty: item.qty || 1,

        total:
          (item.price ||
            item?.product?.price ||
            0) * (item.qty || 1),
      })),

      subtotal: cartTotal,

      shipping,

      total,

      status: "Pending",
    };

    // ======================
    // PRODUCTS MESSAGE
    // ======================
    const productsText = cart
      .map((item, index) => {
        const product = item?.product || item;

        const image =
          product?.images?.[0]?.url ||
          product?.image ||
          "/placeholder.png";

        return `
${index + 1}. ${product?.name}

📏 Size: ${item?.size || product?.size || "N/A"}

🔢 Qty: ${item?.qty || 1}

💵 Price: ₹${product?.price || 0}

🧾 Total: ₹${
          (product?.price || 0) *
          (item?.qty || 1)
        }

🖼 Product Image:
${image}
`;
      })
      .join("\n");

    // ======================
    // WHATSAPP MESSAGE
    // ======================
    const message = `
🛍 *NEW ORDER — INSPIRIT CLOTHING*

👤 *Customer Details*
Name: ${firstName} ${lastName}
Email: ${user?.email}
Phone: ${phone}

📍 *Shipping Address*
${address}
${city}, ${stateName}
${countryName} - ${postalCode}

📦 *Order Items*
${productsText}

💰 *Order Summary*
Subtotal: ₹${cartTotal.toFixed(2)}
Shipping: ₹${shipping}
Total: ₹${total.toFixed(2)}
`;

    // ======================
    // WHATSAPP NUMBER
    // ======================
    const whatsappNumber = "917397284491";

    // ======================
    // OPEN WHATSAPP
    // ======================
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    try {
      // SAVE ORDER
      await axios.post(`${API}/api/orders`, orderData);

      // OPEN WHATSAPP
      window.open(whatsappURL, "_blank");

      // CLEAR CART
      await clearCart();

      setDone(true);

      toast.success("Order placed successfully");

      setTimeout(() => nav("/account"), 4000);
    } catch (error) {
      console.log(error);

      toast.error("Failed to place order");
    }
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

          <h1 className="mt-8 text-5xl font-black">
            Order Confirmed
          </h1>

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

        <form
          onSubmit={submit}
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* LEFT */}
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
                disabled
                className="w-full px-4 py-4 border rounded-xl outline-none bg-gray-100"
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

                {/* PHONE */}
                <div className="md:col-span-2">
                  <PhoneInput
                    international
                    defaultCountry={country}
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter phone number"
                    className="border rounded-xl px-4 py-4"
                  />
                </div>

                <input
                  required
                  name="address"
                  placeholder="Address"
                  className="md:col-span-2 px-4 py-4 border rounded-xl outline-none focus:border-black"
                />

                {/* COUNTRY */}
                <select
                  required
                  name="country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setStateCode("");
                  }}
                  className="md:col-span-2 px-4 py-4 border rounded-xl outline-none focus:border-black bg-white"
                >
                  <option value="">
                    Select Country
                  </option>

                  {countries.map((c) => (
                    <option
                      key={c.isoCode}
                      value={c.isoCode}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* STATE */}
                <select
                  required
                  name="state"
                  value={stateCode}
                  onChange={(e) =>
                    setStateCode(e.target.value)
                  }
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black bg-white"
                >
                  <option value="">
                    Select State
                  </option>

                  {states.map((s) => (
                    <option
                      key={s.isoCode}
                      value={s.isoCode}
                    >
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* CITY */}
                <select
                  required
                  name="city"
                  className="px-4 py-4 border rounded-xl outline-none focus:border-black bg-white"
                >
                  <option value="">
                    Select City
                  </option>

                  {cities.map((c) => (
                    <option
                      key={c.name}
                      value={c.name}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* POSTAL */}
                <input
                  required
                  name="postalCode"
                  placeholder="Postal code"
                  className="md:col-span-2 px-4 py-4 border rounded-xl outline-none focus:border-black"
                />
              </div>
            </section>

            {/* BUTTON */}
            <button className="mt-8 w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3">
              <FaWhatsapp className="text-2xl text-green-400" />
              ORDER VIA WHATSAPP
            </button>
          </div>

          {/* RIGHT */}
          <aside className="bg-white border rounded-3xl p-7 h-fit sticky top-28 shadow-sm">
            <h3 className="text-3xl font-black">
              Order Summary
            </h3>

            {/* PRODUCTS */}
            <div className="mt-6 space-y-4 max-h-96 overflow-auto">
              {cart.map((item, index) => {
                const product =
                  item?.product || item;

                if (!product) return null;

                return (
                  <div
                    key={product?._id || index}
                    className="flex gap-4 border-b pb-4"
                  >
                    <img
                      src={
                        product?.images?.[0]?.url ||
                        product?.image ||
                        "/placeholder.png"
                      }
                      alt={product?.name}
                      className="h-20 w-16 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="flex-1">
                      <p className="font-semibold line-clamp-1">
                        {product?.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Size:{" "}
                        {item?.size ||
                          product?.size ||
                          "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item?.qty || 1}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹{product?.price || 0}
                      </p>
                    </div>

                    <div className="font-semibold">
                      ₹
                      {(
                        (product?.price || 0) *
                        (item?.qty || 1)
                      ).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PRICE */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span>
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping}`}
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t text-2xl font-black">
                <span>Total</span>

                <span>
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

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