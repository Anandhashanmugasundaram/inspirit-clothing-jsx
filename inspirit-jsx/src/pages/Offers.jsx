import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import ProductCard from "@/components/site/ProductCard";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    () => Date.now() + 1000 * 60 * 60 * 48,
  )[0];

  const { d, h, m, s } = useCountdown(target);

  // ======================
  // TEMPORARY SPLIT
  // ======================
  const sale = products.slice(0, 4);

  const limited = products.slice(4, 8);

  // ======================
  // TIMER CELL
  // ======================
  const cell = (v, l) => (
    <div className="text-center">
      <div className="text-display text-5xl md:text-7xl text-white tabular-nums leading-none">
        {String(v).padStart(2, "0")}
      </div>

      <div className="text-grotesk text-[10px] md:text-xs tracking-[0.3em] text-white/50 mt-2">
        {l}
      </div>
    </div>
  );

  return (
    <div className="bone-section pt-32 md:pt-40 pb-24">
      {/* HERO */}
      <section className="ink-section -mt-32 md:-mt-40 pt-44 md:pt-56 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.25 27 / 0.35), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10 text-center">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)] animate-pulse">
            — FLASH RITE LIVE
          </p>

          <h1 className="mt-4 text-display text-6xl md:text-9xl leading-[0.9] text-white">
            48 hours.
            <br />
            <em className="text-[oklch(0.65_0.25_27)] not-italic">
              Then gone.
            </em>
          </h1>

          <div className="mt-12 inline-flex items-center gap-6 md:gap-10 glass px-8 py-6 rounded-sm">
            {cell(d, "DAYS")}

            <span className="text-white/30 text-4xl">
              :
            </span>

            {cell(h, "HRS")}

            <span className="text-white/30 text-4xl">
              :
            </span>

            {cell(m, "MIN")}

            <span className="text-white/30 text-4xl">
              :
            </span>

            {cell(s, "SEC")}
          </div>

          <p className="mt-8 text-white/60">
            Use code{" "}
            <span className="text-[oklch(0.65_0.25_27)] font-mono">
              RITUAL10
            </span>{" "}
            at checkout for 10% off everything.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block btn-blood px-8 py-4 text-grotesk tracking-[0.3em]"
          >
            SHOP THE FLASH
          </Link>
        </div>
      </section>

      {/* LOADING */}
      {loading ? (
        <div className="py-40 flex justify-center">
          <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* SALE */}
          <section className="py-24">
            <div className="mx-auto max-w-[1500px] px-5 md:px-10">
              <h2 className="text-display text-5xl md:text-6xl">
                On the altar.
              </h2>

              <p className="mt-3 text-[oklch(0.45_0.01_20)]">
                Featured pieces from the latest drop.
              </p>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                {sale.map((p) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* LIMITED */}
          <section className="ink-section py-24">
            <div className="mx-auto max-w-[1500px] px-5 md:px-10">
              <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">
                — EXCLUSIVE
              </p>

              <h2 className="mt-3 text-display text-5xl md:text-6xl text-white">
                The numbered capsule.
              </h2>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                {limited.map((p) => (
                  <div
                    key={p._id}
                    className="text-white"
                  >
                    <ProductCard p={p} />
                  </div>
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