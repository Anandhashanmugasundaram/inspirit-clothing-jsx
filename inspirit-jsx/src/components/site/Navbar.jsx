import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";

import {
  FiSearch,
  FiUser,
 FiShoppingBag,
  FiShield,
} from "react-icons/fi";

import Logo from "./Logo";
import { useApp } from "@/context/AppContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "Story" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const { cartCount, user, logout, isAdmin } = useApp();

  const loc = useLocation();

  const isProductPage =
    loc.pathname.includes("/product/") ||
    loc.pathname.includes("/account") ||
    loc.pathname.includes("/cart") ||
    loc.pathname.includes("/admin") ||
    loc.pathname.includes("/checkout");

  // =========================
  // SCROLL EFFECT
  // =========================
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);

    on();

    window.addEventListener("scroll", on, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", on);
  }, []);

  // =========================
  // CLOSE MENUS ON ROUTE
  // =========================
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [loc.pathname]);

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isProductPage
            ? "bg-black/70 border-b border-cyan-500/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 flex items-center justify-between">
          {/* LOGO */}
          <Logo />

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-grotesk text-sm tracking-[0.25em] text-slate-300 hover:text-cyan-400 relative group transition duration-300"
              >
                {n.label}

                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-400 transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-5 text-white">
            {/* SEARCH */}
            <button
              className="hidden md:inline-flex hover:text-cyan-400 transition duration-300"
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>

            {/* USER */}
            <div className="relative">
              {user ? (
                <>
                  {/* AVATAR */}
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="hover:text-cyan-400 transition duration-300"
                  >
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User",
                        )}`
                      }
                      alt="user"
                      className="w-8 h-8 rounded-full object-cover border border-cyan-400/30"
                    />
                  </button>

                  {/* DROPDOWN */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-slate-900/95 border border-cyan-500/20 rounded-xl shadow-2xl overflow-hidden">
                      <Link
                        to="/account"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10 transition"
                      >
                        My Account
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10 transition"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={async () => {
                          await logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/register"
                  className="hover:text-cyan-400 transition duration-300"
                >
                  <FiUser className="text-xl" />
                </Link>
              )}
            </div>

            {/* CART */}
            <Link
              to="/cart"
              className="relative hover:text-cyan-400 transition duration-300"
              aria-label="Bag"
            >
              <FiShoppingBag className="text-xl" />

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-white hover:text-cyan-400 transition duration-300"
            >
              <HiOutlineMenuAlt4 className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden transition ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* OVERLAY */}
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* SIDEBAR */}
        <aside
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-slate-950 border-l border-cyan-500/20 p-7 flex flex-col transition-transform duration-500 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* TOP */}
          <div className="flex items-center justify-between">
            <Logo />

            <button onClick={() => setOpen(false)}>
              <HiOutlineX className="text-2xl text-white hover:text-cyan-400 transition" />
            </button>
          </div>

          {/* NAV */}
          <nav className="mt-12 flex flex-col gap-1">
            {NAV.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="group block py-4 border-b border-white/10"
              >
                <span className="text-grotesk text-3xl text-white group-hover:text-cyan-400 transition duration-300">
                  {String(i + 1).padStart(2, "0")}. {n.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="mt-auto text-white/40 text-xs tracking-[0.3em] text-grotesk">
            © INSPIRIT — RITUAL WEAR
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-black/70 border border-cyan-500/20 rounded-full px-6 py-3 flex items-center justify-between text-white">
        {/* HOME */}
        <Link to="/" aria-label="Home">
          <FiSearch className="text-lg hover:text-cyan-400 transition duration-300" />
        </Link>

        {/* SHOP */}
        <Link to="/shop">
          <span className="text-grotesk text-sm tracking-[0.2em] hover:text-cyan-400 transition duration-300">
            SHOP
          </span>
        </Link>

        {/* ADMIN */}
        {isAdmin && (
          <Link to="/admin" aria-label="Admin">
            <FiShield className="text-lg hover:text-cyan-400 transition duration-300" />
          </Link>
        )}

        {/* ACCOUNT */}
        <Link to="/account" aria-label="Account">
          <FiUser className="text-lg hover:text-cyan-400 transition duration-300" />
        </Link>

        {/* CART */}
        <Link to="/cart" className="relative">
          <FiShoppingBag className="text-lg hover:text-cyan-400 transition duration-300" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </>
  );
}