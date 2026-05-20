import { Link } from "react-router-dom";
import { useApp } from '@/context/AppContext';
export default function ProductCard({ p }) {
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const wished = wishlist.includes(p.id);
    return (<article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-[oklch(0.92_0.005_60)] rounded-sm">
        <Link to={`/product/${p.slug}`} className="block h-full w-full">
          <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover hover-zoom-img group-hover:scale-[1.06]"/>
          <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
        </Link>
        {p.badge && (<span className={`absolute top-3 left-3 text-grotesk text-xs tracking-[0.2em] px-3 py-1 ${p.badge === 'SALE' ? 'bg-black text-white' : 'bg-[oklch(0.55_0.25_27)] text-white'}`}>
            {p.badge}
          </span>)}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button onClick={() => addToCart(p)} className="w-full bg-black text-white text-grotesk text-sm tracking-[0.25em] py-3 hover:bg-[oklch(0.48_0.22_25)] transition">
            QUICK ADD
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">{p.category.toUpperCase()}</p>
          <Link to={`/product/${p.slug}`} className="block mt-1 font-medium hover:text-[oklch(0.48_0.22_25)] transition">{p.name}</Link>
        </div>
        <div className="text-right">
          <p className="font-semibold">${p.price}</p>
          {p.oldPrice && <p className="text-xs text-[oklch(0.45_0.01_20)] line-through">${p.oldPrice}</p>}
        </div>
      </div>
    </article>);
}
