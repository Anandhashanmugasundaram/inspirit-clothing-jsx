import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function ProductCard({ p }) {
  const { addToCart, wishlist } = useApp();

  console.log("PRODUCT:", p);
  console.log("IMAGES:", p.images);

  const wished = wishlist.includes(p._id);

  // SUPPORT BOTH STRING + OBJECT FORMAT
  const mainImage =
    typeof p.images?.[0] === "string" ? p.images[0] : p.images?.[0]?.url;

  const hoverImage =
    typeof p.images?.[1] === "string" ? p.images[1] : p.images?.[1]?.url;

  return (
    <article className="group relative">
      {/* IMAGE */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[oklch(0.92_0.005_60)] rounded-sm">
        <Link to={`/product/${p._id}`} className="block h-full w-full">
          {/* MAIN IMAGE */}
          <img
            src={mainImage || "https://placehold.co/600x800?text=Product"}
            alt={p.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
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
        </Link>

        {/* BADGE */}
        {p.badge && (
          <span
            className={`absolute top-3 left-3 text-grotesk text-xs tracking-[0.2em] px-3 py-1 ${
              p.badge === "SALE"
                ? "bg-black text-white"
                : "bg-[oklch(0.48_0.22_25)] text-white"
            }`}
          >
            {p.badge}
          </span>
        )}

        {/* QUICK ADD */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={() => addToCart(p)}
            className="w-full bg-black text-white text-grotesk text-sm tracking-[0.25em] py-3 hover:bg-[oklch(0.48_0.22_25)] transition"
          >
            QUICK ADD
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">
            {p.category?.toUpperCase()}
          </p>

          <Link
            to={`/product/${p._id}`}
            className="block mt-1 font-medium hover:text-[oklch(0.48_0.22_25)] transition"
          >
            {p.name}
          </Link>
        </div>

        <div className="text-right">
          <p className="font-semibold">₹{p.price}</p>

          {p.oldPrice && (
            <p className="text-xs text-[oklch(0.45_0.01_20)] line-through">
              ₹{p.oldPrice}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
