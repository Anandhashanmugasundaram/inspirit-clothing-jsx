import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ProductCard({ p }) {
  const { addToCart } = useApp();

  // ==========================
  // OUT OF STOCK CHECK
  // ==========================
  const sizesObj = p.sizes instanceof Map
    ? Object.fromEntries(p.sizes)
    : p.sizes || {};

  const isOutOfStock = Object.values(sizesObj).every((stock) => stock <= 0);

  // ==========================
  // IMAGE URL
  // ==========================
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x800?text=No+Image";
    const url = typeof img === "string" ? img : img.url;
    if (url?.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const mainImage = getImageUrl(p.images?.[0]);
  const hoverImage = p.images?.[1] ? getImageUrl(p.images?.[1]) : null;

  return (
    <article className="group relative h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white via-slate-100 to-gray-200 shadow-lg transition-all duration-500 hover:shadow-2xl">

        {/* BG */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gray-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" />
        </div>

        {/* IMAGE AREA */}
        <div className="relative">
          <Link
            to={`/product/${p._id}`}
            className="relative block w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#f7f7f7]"
          >
            {/* MAIN IMAGE */}
            <img
              src={mainImage}
              alt={p.name}
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x800?text=Image+Error";
              }}
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                isOutOfStock ? "grayscale opacity-60" : ""
              }`}
            />

            {/* HOVER IMAGE */}
            {hoverImage && !isOutOfStock && (
              <img
                src={hoverImage}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/5 opacity-0 transition duration-500 group-hover:opacity-100" />

            {/* OUT OF STOCK OVERLAY */}
            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                <span className="bg-white text-black text-[10px] font-bold tracking-[0.35em] px-5 py-2 rounded-full shadow-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* BADGE — hide if out of stock */}
            {p.badge && !isOutOfStock && (
              <span
                className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[9px] font-bold tracking-[0.2em] backdrop-blur-md ${
                  p.badge === "SALE"
                    ? "bg-black text-white"
                    : "bg-white/80 text-black"
                }`}
              >
                {p.badge}
              </span>
            )}

            {/* VIEW */}
            <div className="absolute top-3 right-3 translate-x-10 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white/80 text-black backdrop-blur-md transition hover:border-black">
                <Eye className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* QUICK ADD — hidden if out of stock */}
          {!isOutOfStock && (
            <div className="absolute left-3 right-3 bottom-4 z-20 translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(p);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-[11px] font-semibold tracking-[0.15em] text-white transition hover:bg-gray-800"
              >
                <ShoppingBag className="h-3 w-3" />
                QUICK ADD
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="relative flex flex-1 flex-col p-4 backdrop-blur-sm">

          {/* CATEGORY */}
          <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-gray-500">
            {p.category}
          </p>

          {/* NAME */}
          <Link
            to={`/product/${p._id}`}
            className="block min-h-[44px] text-sm font-semibold text-black transition hover:text-gray-700 line-clamp-2"
          >
            {p.name}
          </Link>

          {/* PRICE */}
          {/* <div className="mt-2 flex items-center gap-2">
            <p className={`text-sm font-bold ${isOutOfStock ? "text-gray-400" : "text-black"}`}>
              ₹{p.price}
            </p>
            {p.oldPrice && (
              <p className="text-xs text-gray-400 line-through">₹{p.oldPrice}</p>
            )}
            {isOutOfStock && (
              <span className="text-[10px] text-red-500 font-semibold tracking-wider">
                SOLD OUT
              </span>
            )}
          </div> */}
          {/* PRICE */}
<div className="mt-2 flex items-center gap-2">
  <p className={`text-sm font-bold ${isOutOfStock ? "text-gray-400" : "text-black"}`}>
    ₹{p.price}
  </p>
  {p.oldPrice > p.price && (
    <>
      <p className="text-xs text-gray-400 line-through">₹{p.oldPrice}</p>
      <span className="text-[10px] font-semibold text-green-600">
        {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
      </span>
    </>
  )}
  {isOutOfStock && (
    <span className="text-[10px] text-red-500 font-semibold tracking-wider">
      SOLD OUT
    </span>
  )}
</div>
        </div>
      </div>
    </article>
  );
}