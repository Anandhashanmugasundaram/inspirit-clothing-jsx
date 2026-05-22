import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";

import { useApp } from "@/context/AppContext";

export default function ProductCard({ p }) {
  const { addToCart } = useApp();

  // SUPPORT BOTH STRING + OBJECT FORMAT
  const mainImage =
    typeof p.images?.[0] === "string"
      ? p.images[0]
      : p.images?.[0]?.url;

  const hoverImage =
    typeof p.images?.[1] === "string"
      ? p.images[1]
      : p.images?.[1]?.url;

  return (
    <article className="group relative max-w-[440px]">
      {/* CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white via-slate-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500">

        {/* BACKGROUND DESIGN */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-black/5 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gray-400/10 blur-3xl" />

          <div className="absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" />
        </div>

        {/* IMAGE SECTION */}
        <Link
          to={`/product/${p._id}`}
          className="relative block h-[320px] overflow-hidden bg-[#f7f7f7]"
        >
          {/* MAIN IMAGE */}
          <img
            src={
              mainImage ||
              "https://placehold.co/600x800?text=Product"
            }
            alt={p.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          {/* HOVER IMAGE */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* BADGE */}
          {p.badge && (
            <span
              className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] backdrop-blur-md ${
                p.badge === "SALE"
                  ? "bg-black text-white"
                  : "bg-white/80 text-black"
              }`}
            >
              {p.badge}
            </span>
          )}

          {/* VIEW BUTTON */}
          <div className="absolute top-3 right-3 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white flex items-center justify-center text-black hover:border-black transition">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* QUICK ADD */}
        <div className="absolute left-3 right-3 bottom-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(p);
            }}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold tracking-[0.15em] text-[11px] hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3 h-3" />
            QUICK ADD
          </button>
        </div>

        {/* CONTENT */}
        <div className="relative p-4 backdrop-blur-sm">
          
          {/* CATEGORY */}
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-1">
            {p.category}
          </p>

          {/* PRODUCT NAME */}
          <Link
            to={`/product/${p._id}`}
            className="block text-black font-semibold text-sm hover:text-gray-700 transition line-clamp-1"
          >
            {p.name}
          </Link>

          {/* PRICE */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-black font-bold text-sm">
              ₹{p.price}
            </p>

            {p.oldPrice && (
              <p className="text-xs text-gray-400 line-through">
                ₹{p.oldPrice}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}