import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import ProductCard from "@/components/site/ProductCard";
import ImageThree from "../assets/covercompimg.png";

function Shop() {
  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx-oi4h.vercel.app";

  // ======================
  // STATES
  // ======================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cat, setCat] = useState("All");
  const [size, setSize] = useState("All");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("latest");

  const [open, setOpen] = useState(false);

  // PAGINATION
  const [page, setPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  // ======================
  // SCROLL TO TOP
  // ======================
  const scrollTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        immediate: true,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ======================
  // FETCH PRODUCTS
  // ======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        setProducts(res.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ======================
  // RESET PAGE WHEN FILTER CHANGES
  // ======================
  useEffect(() => {
    setPage(1);
  }, [cat, size, q, sort]);

  // ======================
  // CATEGORIES
  // ======================
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // ======================
  // SIZES
  // ======================
  const sizes = ["All", "S", "M", "L", "XL"];

  // ======================
  // FILTER PRODUCTS
  // ======================
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const categoryMatch = cat === "All" || p.category === cat;
      const sizeMatch =
        size === "All" ||
        (p.sizes &&
          typeof p.sizes === "object" &&
          Object.keys(p.sizes).includes(size));
      const searchMatch = p.name?.toLowerCase().includes(q.toLowerCase());
      return categoryMatch && sizeMatch && searchMatch;
    });

    // SORTING
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    if (sort === "latest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    // PUSH OUT OF STOCK TO END
    const isOOS = (p) => {
      const sizesObj =
        p.sizes instanceof Map ? Object.fromEntries(p.sizes) : p.sizes || {};
      return Object.values(sizesObj).every((stock) => stock <= 0);
    };

    list = [
      ...list.filter((p) => !isOOS(p)),
      ...list.filter((p) => isOOS(p)),
    ];

    return list;
  }, [products, cat, size, q, sort]);

  // ======================
  // PAGINATION
  // ======================
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  return (
    <div className="bone-section pt-32 md:pt-40 pb-24">
      {/* HEADER */}
      <section className="relative -mt-32 md:-mt-40 pt-44 md:pt-56 pb-20 md:pb-28 overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <img
          src={ImageThree}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] md:object-center opacity-85"
        />

        {/* WARM GRADIENT OVERLAY */}
          <div
            className="absolute inset-0"
            style={{
              background:
  "linear-gradient(180deg, rgba(255,248,240,0.15) 0%, rgba(245,230,220,0.22) 50%, rgba(255,255,255,0.08) 100%)",
            }}
          />

        {/* RED ACCENT GLOW */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 20% 100%, oklch(0.55 0.25 27 / 0.5), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">
            — THE COLLECTION
          </p>

          <h1 className="mt-4 text-display text-6xl md:text-[8rem] leading-[0.9] text-white">
            Shop the
            <br />
            <em className="text-[oklch(0.65_0.25_27)] not-italic">canon.</em>
          </h1>

          <p className="mt-6 max-w-xl text-white/60">
            Every piece, every silhouette, every chapter.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-10 mt-12">
        {/* FILTER BAR */}
        <div className="border-y border-black/10 py-5">
          {/* CATEGORY */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  scrollTop();
                }}
                className={`shrink-0 text-grotesk text-xs tracking-[0.25em] px-4 py-2 rounded-full border transition ${
                  cat === c
                    ? "bg-black text-white border-black"
                    : "border-black/15 hover:border-black"
                }`}
              >
                {String(c).toUpperCase()}
              </button>
            ))}
          </div>

          {/* SIZE FILTER */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  scrollTop();
                }}
                className={`text-grotesk text-xs tracking-[0.25em] px-4 py-2 rounded-full border transition ${
                  size === s
                    ? "bg-black text-white border-black"
                    : "border-black/15 hover:border-black"
                }`}
              >
                SIZE {s}
              </button>
            ))}
          </div>

          {/* SEARCH + SORT */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-5">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pieces…"
                className="w-full pl-11 pr-4 py-3 bg-[oklch(0.94_0.005_60)] outline-none rounded-sm focus:bg-white border border-transparent focus:border-black/20"
              />
            </div>

            {/* SORT */}
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  scrollTop();
                }}
                className="text-grotesk text-xs tracking-[0.25em] py-3 px-4 bg-[oklch(0.94_0.005_60)] rounded-sm border border-transparent focus:border-black/20 outline-none"
              >
                <option value="latest">LATEST</option>
                <option value="price-asc">PRICE ↑</option>
                <option value="price-desc">PRICE ↓</option>
              </select>

              {/* MOBILE FILTER */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex items-center gap-2 px-4 py-3 border border-black/15 rounded-sm"
              >
                <FiFilter />
                <span className="text-grotesk text-xs tracking-[0.25em]">
                  FILTERS
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
              {paginatedProducts.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16 flex-wrap">
                {/* PREV */}
                <button
                  onClick={() => {
                    setPage((p) => Math.max(p - 1, 1));
                    scrollTop();
                  }}
                  disabled={page === 1}
                  className={`px-4 py-2 border text-sm tracking-[0.2em] transition ${
                    page === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  PREV
                </button>

                {/* PAGE NUMBERS */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        scrollTop();
                      }}
                      className={`w-11 h-11 border text-sm transition ${
                        page === pageNum
                          ? "bg-black text-white border-black"
                          : "border-black/20 hover:border-black"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* NEXT */}
                <button
                  onClick={() => {
                    setPage((p) => Math.min(p + 1, totalPages));
                    scrollTop();
                  }}
                  disabled={page === totalPages}
                  className={`px-4 py-2 border text-sm tracking-[0.2em] transition ${
                    page === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  NEXT
                </button>
              </div>
            )}

            {/* EMPTY */}
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-display text-3xl">Nothing in this corner.</p>
                <p className="mt-2 text-[oklch(0.45_0.01_20)]">
                  Try clearing your filters.
                </p>
                <button
                  onClick={() => {
                    setCat("All");
                    setSize("All");
                    setQ("");
                    setPage(1);
                    scrollTop();
                  }}
                  className="mt-6 bg-black text-white px-6 py-3"
                >
                  RESET
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MOBILE FILTER SHEET */}
      {open && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-white p-6 rounded-t-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-display text-2xl">Filters</h3>
              <button onClick={() => setOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* CATEGORY */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCat(c);
                    setOpen(false);
                    scrollTop();
                  }}
                  className={`py-3 rounded-sm border text-grotesk text-xs tracking-[0.25em] ${
                    cat === c ? "bg-black text-white" : "border-black/15"
                  }`}
                >
                  {String(c).toUpperCase()}
                </button>
              ))}
            </div>

            {/* SIZE */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setOpen(false);
                    scrollTop();
                  }}
                  className={`py-3 rounded-sm border text-grotesk text-xs tracking-[0.25em] ${
                    size === s ? "bg-black text-white" : "border-black/15"
                  }`}
                >
                  SIZE {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;