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

import ImageOne from "../assets/cover_img1.jpg";
import ImageTwo from "../assets/cover_img2.png";
import ImageThree from "../assets/covercompimg.png";

import { TESTIMONIALS } from "@/data/products";

import { useApp } from "@/context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  // { tag: "MINIMAL FITS", title: "BLACK &\nWHITE", img: ImageOne },
  // { tag: "MINIMAL FITS", title: "BLACK &\nWHITE", img: ImageTwo },
  { tag: "MINIMAL FITS", title: "BLACK &\nWHITE", img: ImageThree },
];

function Home() {
  const heroRef = useRef(null);
  const horizRef = useRef(null);
  const { isAdmin, user } = useApp();
  const [products, setProducts] = useState([]);

  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx-1.onrender.com";

  // ======================
  // FETCH PRODUCTS
  // ======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
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

  // ONLY LATEST 5 PRODUCTS
  const featured = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div ref={heroRef}>

   {/* ======================== HERO ======================== */}
<section className="relative h-[80svh] w-full overflow-hidden ink-section">
  <Swiper
    modules={[Autoplay, EffectFade, Pagination]}
    effect="fade"
    autoplay={{ delay: 5500 }}
    loop
    pagination={{ clickable: true }}
    className="absolute inset-0 h-full w-full"
  >
    {HERO_SLIDES.map((s, i) => (
      <SwiperSlide key={i}>
        <div className="absolute inset-0">
          <img
            src={s.img}
            alt=""
className="absolute inset-0 h-full w-full object-cover object-[center_20%] md:object-center opacity-85"          />
          <div
            className="absolute inset-0"
            style={{
              background:
  "linear-gradient(180deg, rgba(255,248,240,0.15) 0%, rgba(245,230,220,0.22) 50%, rgba(255,255,255,0.08) 100%)",
            }}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* HERO TEXT */}
  <div className="absolute inset-0 z-10 h-full flex flex-col justify-end pb-2">
    <div className="mx-auto w-full max-w-[1500px] px-5 md:px-10">

      <div className="hero-fade flex items-center gap-3 text-grotesk text-xs tracking-[0.4em] text-white/70 mb-6">
        <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.25_27)] animate-pulse-glow" />
        INSPIRIT — CHAPTER 07 LIVE
      </div>

      <h1 className="text-display text-[18vw] md:text-[10vw] leading-[0.85] text-white tracking-[-0.04em]">
        <span className="block overflow-hidden">
          <span className="split-line block">WEAR THE</span>
        </span>
        <span className="block overflow-hidden">
          <span className="split-line block text-[oklch(0.65_0.25_27)] italic">
            RITUAL.
          </span>
        </span>
      </h1>

      <div className="mt-10 mb-8 flex flex-col md:flex-row md:items-center gap-6 hero-fade">
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
  </div>
</section>

      {/* ======================== MARQUEE ======================== */}
      <Marquee
        variant="red"
        items={[
          "LIMITED DROP",
          "ANIME STREETWEAR",
          "PREMIUM QUALITY",
          "NEW ARRIVALS",
          "INSPIRIT",
        ]}
      />

      {/* ======================== FEATURED ======================== */}
      <section className="bone-section py-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex items-end justify-between mb-10 reveal">
            <div>
              <p className="text-sm tracking-[0.35em] uppercase text-[oklch(0.55_0.25_27)]">
                — Featured Collection
              </p>
              <h2
                className="mt-3 text-[60px] md:text-[100px] leading-[0.9] tracking-[-0.05em]"
                style={{
                  fontFamily: '"Bodoni Moda", "Cormorant Garamond", serif',
                  fontWeight: 600,
                }}
              >
                Latest Drops.
              </h2>
              <p className="mt-4 text-gray-500 max-w-xl">
                Newly added premium streetwear pieces from the latest collection.
              </p>
            </div>
          </div>

          {/* 5 PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featured.map((p) => (
              <div key={p._id} className="reveal">
                <ProductCard p={p} />
              </div>
            ))}
          </div>

          {/* VIEW MORE */}
          <div className="flex justify-center mt-16 reveal">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-black text-white tracking-[0.25em] text-sm uppercase hover:bg-[oklch(0.55_0.25_27)] transition duration-300"
            >
              View More
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
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
                  {Array.from({ length: t.rating }).map((_, k) => (
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

    </div>
  );
}

export default Home;