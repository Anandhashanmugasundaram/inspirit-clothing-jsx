import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { FiArrowRight, FiStar, FiShield } from "react-icons/fi";

import Marquee from "@/components/site/Marquee";
import ProductCard from "@/components/site/ProductCard";
import Counter from "@/components/site/Counter";

import { TESTIMONIALS } from "@/data/products";

import { useApp } from "@/context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    tag: "CHAPTER 07 — ASHES",
    title: "WEAR THE\nRITUAL",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=85&auto=format",
  },
  {
    tag: "LIMITED — 300 PIECES",
    title: "BLOOD\nTONE",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2000&q=85&auto=format",
  },
  {
    tag: "NEW DROP — SS26",
    title: "CATHEDRAL\nCUTS",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&q=85&auto=format",
  },
];

function Home() {
  const heroRef = useRef(null);

  const horizRef = useRef(null);

  const { isAdmin, user } = useApp();

  const [products, setProducts] = useState([]);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ======================
  // FETCH PRODUCTS
  // ======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);

        console.log("HOME PRODUCTS:", res.data);

        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  // ======================
  // GSAP
  // ======================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // HERO TEXT
      gsap.utils.toArray(".split-line").forEach((el, i) => {
        gsap.from(el, {
          y: "110%",
          duration: 1.2,
          ease: "expo.out",
          delay: 0.2 + i * 0.1,
        });
      });

      gsap.from(".hero-fade", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.6,
      });

      // REVEAL
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // PARALLAX
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: "none",

          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // HORIZONTAL
      if (horizRef.current) {
        const track = horizRef.current.querySelector(".h-track");

        if (track) {
          const dist = track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: -dist,
            ease: "none",

            scrollTrigger: {
              trigger: horizRef.current,
              start: "top top",
              end: `+=${dist}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div ref={heroRef}>
      {/* HERO */}
      <section className="relative h-[100svh] w-full overflow-hidden ink-section">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{
            delay: 5500,
          }}
          loop
          pagination={{
            clickable: true,
          }}
          className="absolute inset-0 h-full w-full"
        >
          {HERO_SLIDES.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="absolute inset-0">
                <img
                  src={s.img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.06 0.005 20 / 0.3) 0%, oklch(0.06 0.005 20 / 0.85) 100%)",
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-10 h-full flex flex-col justify-end pb-24 md:pb-32">
          <div className="hero-fade flex items-center gap-3 text-grotesk text-xs tracking-[0.4em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.25_27)] animate-pulse-glow" />
            INSPIRIT — CHAPTER 07 LIVE
          </div>

          <h1 className="mt-6 text-display text-[18vw] md:text-[10vw] leading-[0.85] text-white tracking-[-0.04em]">
            <span className="block overflow-hidden">
              <span className="split-line block">WEAR THE</span>
            </span>

            <span className="block overflow-hidden">
              <span className="split-line block text-[oklch(0.65_0.25_27)] italic">
                RITUAL.
              </span>
            </span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6 hero-fade">
            <Link
              to="/shop"
              className="group btn-blood inline-flex items-center gap-3 px-8 py-4 text-grotesk tracking-[0.3em]"
            >
              ENTER THE DROP
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about"
              className="text-white/80 hover:text-white text-grotesk tracking-[0.3em] underline underline-offset-8 decoration-1 decoration-[oklch(0.55_0.25_27)]"
            >
              READ THE MANIFESTO
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bone-section py-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex items-end justify-between mb-10 reveal">
            <h2 className="text-display text-4xl md:text-6xl">
              Featured Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {featured.map((p) => (
              <div key={p._id} className="reveal">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bone-section py-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="text-center reveal">
            <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">
              — THE WEARERS
            </p>

            <h2 className="mt-3 text-display text-5xl md:text-7xl">
              Worn by the world.
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal glass-light p-7 rounded-sm">
                <div className="flex gap-1 text-[oklch(0.48_0.22_25)]">
                  {Array.from({
                    length: t.rating,
                  }).map((_, k) => (
                    <FiStar key={k} className="fill-current" />
                  ))}
                </div>

                <p className="mt-4 text-[oklch(0.18_0.01_20)] leading-relaxed">
                  "{t.text}"
                </p>

                <div className="mt-6 text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">
                  {t.name} — {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADMIN FLOAT BUTTON */}
      {isAdmin && user && (
        <Link
          to="/admin"
          className="fixed bottom-6 left-6 z-[100] h-16 w-16 rounded-full bg-[oklch(0.55_0.25_27)] text-white flex items-center justify-center shadow-2xl border border-white/20 hover:scale-110 transition duration-300"
        >
          <FiShield className="text-2xl" />
        </Link>
      )}
    </div>
  );
}

export default Home;
