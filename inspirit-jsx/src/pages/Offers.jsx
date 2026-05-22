import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import ProductCard from "@/components/site/ProductCard";

const API =
  const API = import.meta.env.VITE_API_URL || "https://inspirit-clothing-jsx.onrender.com";

function useCountdown(target) {
  const [t, setT] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setT(target - Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  const clamp = Math.max(0, t);

  return {
    d: Math.floor(clamp / 86400000),

    h: Math.floor((clamp / 3600000) % 24),

    m: Math.floor((clamp / 60000) % 60),

    s: Math.floor((clamp / 1000) % 60),
  };
}

function Offers() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH PRODUCTS
  // ======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API}/api/products`,
        );

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
  // COUNTDOWN
  // ======================
  const target = useState(
    () => Date.now() + 1000 * 60 * 60 * 72,
  )[0];

  const { d, h, m, s } = useCountdown(target);

  // ======================
  // PRODUCT SPLIT
  // ======================
  const newDrop = products.slice(0, 4);

  const exclusive = products.slice(4, 8);

  // ======================
  // TIMER CELL
  // ======================
  const cell = (v, l) => (
    <div className="text-center">
      <div className="text-5xl md:text-7xl font-black text-white leading-none">
        {String(v).padStart(2, "0")}
      </div>

      <div className="text-[10px] md:text-xs tracking-[0.4em] text-white/50 mt-2 uppercase">
        {l}
      </div>
    </div>
  );

  return (
    <div className="bg-[#f8f5f2] min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white pt-40 pb-32">
        
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 h-72 w-72 bg-red-500/20 blur-3xl rounded-full" />

          <div className="absolute bottom-0 right-0 h-96 w-96 bg-orange-400/10 blur-3xl rounded-full" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10 text-center">
          
          <p className="text-sm tracking-[0.5em] text-red-400 uppercase">
            — Limited Streetwear Drop
          </p>

          <h1
  className="mt-6 text-[72px] md:text-[150px] leading-[0.85] uppercase tracking-[-0.04em]"
  style={{
    fontFamily: '"Bodoni Moda", "Cormorant Garamond", serif',
    fontWeight: 600,
  }}
>
  <span className="text-white">
    WEAR THE
  </span>

  <br />

  <span className="text-red-500">
    FUTURE.
  </span>
</h1>

          <p className="mt-8 max-w-2xl mx-auto text-white/70 text-lg leading-relaxed">
            Premium oversized fits, modern essentials,
            and exclusive drops crafted for the new
            generation street culture.
          </p>

          {/* COUNTDOWN */}
          <div className="mt-14 inline-flex items-center gap-6 md:gap-10 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-6 rounded-3xl">
            {cell(d, "Days")}

            <span className="text-white/20 text-4xl">
              :
            </span>

            {cell(h, "Hours")}

            <span className="text-white/20 text-4xl">
              :
            </span>

            {cell(m, "Minutes")}

            <span className="text-white/20 text-4xl">
              :
            </span>

            {cell(s, "Seconds")}
          </div>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 bg-red-500 hover:bg-red-600 transition rounded-2xl text-sm tracking-[0.2em] font-semibold"
            >
              SHOP NOW
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition rounded-2xl text-sm tracking-[0.2em] font-semibold"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading ? (
        <div className="py-40 flex justify-center">
          <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* NEW DROP */}
          <section className="py-24">
            <div className="mx-auto max-w-[1500px] px-5 md:px-10">
              
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-red-500">
                    — New Offer Arrival
                  </p>

                  <h2 className="mt-3 text-5xl md:text-6xl font-black text-black">
                    Fresh Drops.
                  </h2>
                </div>

                <Link
                  to="/shop"
                  className="hidden md:block text-sm tracking-[0.2em] hover:text-red-500 transition"
                >
                  VIEW ALL →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newDrop.map((p) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* BANNER */}
          <section className="py-24 bg-black text-white overflow-hidden">
            <div className="mx-auto max-w-[1500px] px-5 md:px-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* LEFT */}
                <div>
                  <p className="text-red-400 uppercase tracking-[0.4em] text-sm">
                    — Exclusive Collection
                  </p>

                  <h2 className="mt-5 text-5xl md:text-7xl font-black leading-[0.95]">
                    MADE FOR
                    <br />
                    THE STREETS.
                  </h2>

                  <p className="mt-8 text-white/70 leading-relaxed text-lg">
                    Every piece is designed with bold
                    aesthetics, premium comfort, and
                    modern street energy. Elevate your
                    wardrobe with timeless essentials.
                  </p>

                  <Link
                    to="/shop"
                    className="inline-block mt-10 px-8 py-4 bg-white text-black rounded-2xl font-semibold tracking-[0.2em] hover:bg-red-500 hover:text-white transition"
                  >
                    EXPLORE COLLECTION
                  </Link>
                </div>

                {/* RIGHT */}
                <div className="relative">
                  <div className="absolute -top-10 -left-10 h-40 w-40 border border-red-500/30 rounded-full" />

                  <img
                    src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop"
                    alt="fashion"
                    className="rounded-[40px] h-[650px] w-full object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* EXCLUSIVE */}
          <section className="py-24">
            <div className="mx-auto max-w-[1500px] px-5 md:px-10">
              
              <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.4em] text-red-500">
                  — Trending Now
                </p>

                <h2 className="mt-4 text-5xl md:text-6xl font-black">
                  Most Wanted.
                </h2>

                <p className="mt-5 text-gray-500 max-w-2xl mx-auto">
                  Trending styles loved by the community.
                  Premium fits crafted for everyday flex.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {exclusive.map((p) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Offers;