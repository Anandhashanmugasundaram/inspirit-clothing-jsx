import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";
import Logo from "./Logo";
import { useApp } from "@/context/AppContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/offers", label: "Drops" },
  { to: "/about", label: "Story" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cartCount, user, logout } = useApp();

  const loc = useLocation();
  const isProductPage = loc.pathname.includes("/product/");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [loc.pathname]);

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isProductPage ? "glass py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 flex items-center justify-between">
          <Logo />

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-grotesk text-sm tracking-[0.25em] text-white/80 hover:text-white relative group"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[oklch(0.55_0.25_27)] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-5 text-white">

            {/* SEARCH */}
            <button
              className="hidden md:inline-flex hover:text-[oklch(0.65_0.25_27)] transition"
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>

            {/* USER AUTH */}
            <div className="relative">

              {user ? (
                <>
                  {/* AVATAR */}
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="hover:text-[oklch(0.65_0.25_27)] transition"
                  >
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "User"
                        )}`
                      }
                      alt="user"
                      className="w-8 h-8 rounded-full object-cover border border-white/30"
                    />
                  </button>

                  {/* DROPDOWN */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-black text-white border border-white/10 rounded-lg shadow-lg overflow-hidden">

                      <Link
                        to="/account"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-3 hover:bg-white/10 text-sm"
                      >
                        My Account
                      </Link>

                      <button
                        onClick={async () => {
                          await logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm text-red-400"
                      >
                        Logout
                      </button>

                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/register"
                  className="hover:text-[oklch(0.65_0.25_27)] transition"
                >
                  <FiUser className="text-xl" />
                </Link>
              )}

            </div>

            {/* CART */}
            <Link
              to="/cart"
              className="relative hover:text-[oklch(0.65_0.25_27)] transition"
              aria-label="Bag"
            >
              <FiShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-[oklch(0.55_0.25_27)] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-white"
            >
              <HiOutlineMenuAlt4 className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[80] lg:hidden transition ${open ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-[oklch(0.06_0.005_20)] border-l border-white/10 p-7 flex flex-col transition-transform duration-500 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)}>
              <HiOutlineX className="text-2xl text-white" />
            </button>
          </div>

          <nav className="mt-12 flex flex-col gap-1">
            {NAV.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="group block py-4 border-b border-white/10"
              >
                <span className="text-grotesk text-3xl text-white group-hover:text-[oklch(0.65_0.25_27)] transition">
                  {String(i + 1).padStart(2, "0")}. {n.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto text-white/50 text-xs tracking-[0.3em] text-grotesk">
            © INSPIRIT — RITUAL WEAR
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass rounded-full px-6 py-3 flex items-center justify-between text-white">
        <Link to="/" aria-label="Home">
          <FiSearch className="text-lg" />
        </Link>

        <Link to="/shop">
          <span className="text-grotesk text-sm tracking-[0.2em]">SHOP</span>
        </Link>

        <Link to="/account" aria-label="Account">
          <FiUser className="text-lg" />
        </Link>

        <Link to="/cart" className="relative">
          <FiShoppingBag className="text-lg" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px] rounded-full bg-[oklch(0.55_0.25_27)] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </>
  );
}