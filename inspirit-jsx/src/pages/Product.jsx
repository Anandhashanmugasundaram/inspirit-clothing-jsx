import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { gsap } from "gsap";

import { Swiper, SwiperSlide } from "swiper/react";

import { FreeMode, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiStar,
} from "react-icons/fi";

import { findProduct, PRODUCTS } from "@/data/products";

import { useApp } from "@/context/AppContext";

import ProductCard from "@/components/site/ProductCard";

function ProductPage() {
  const { slug } = useParams();

  const product = findProduct(slug);

  const { addToCart, toggleWishlist, wishlist } = useApp();

  const [size, setSize] = useState("");

  const [qty, setQty] = useState(1);

  const [tab, setTab] = useState("desc");

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const galleryRef = useRef(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // PRODUCT NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Product Not Found
      </div>
    );
  }

  // DEFAULT SIZE
  useEffect(() => {
    if (product.sizes?.length > 0) {
      setSize(product.sizes[Math.min(1, product.sizes.length - 1)]);
    }
  }, [product]);

  // GSAP ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pd-fade", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.from(".pd-image", {
        scale: 1.08,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [slug]);

  // RELATED PRODUCTS
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  // WISHLIST
  const wished = wishlist.includes(product.id);

  return (
    <div className="bone-section pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* BREADCRUMB */}
        <nav className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)] mb-8">
          <Link to="/" className="hover:text-black">
            HOME
          </Link>

          {" / "}

          <Link to="/shop" className="hover:text-black">
            SHOP
          </Link>

          {" / "}

          <span className="text-black">{product.name.toUpperCase()}</span>
        </nav>

        <div ref={galleryRef} className="grid lg:grid-cols-12 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-7 grid grid-cols-[80px_1fr] gap-3">
            {/* THUMBNAILS */}
            <div className="hidden md:block">
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                modules={[FreeMode, Thumbs]}
                freeMode={true}
                watchSlidesProgress={true}
                slidesPerView={4}
                spaceBetween={10}
                className="h-[600px]"
              >
                {product.images.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="cursor-pointer overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* MAIN IMAGE */}
            <div className="col-span-2 md:col-span-1 pd-image">
              <Swiper
                modules={[Thumbs]}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                className="aspect-[3/4] w-full"
              >
                {product.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="group h-full w-full overflow-hidden bg-[oklch(0.94_0.005_60)]">
                      <img
                        src={img}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-1000"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            {/* PRODUCT DETAILS */}
            <div className="pd-fade">
              {product.badge && (
                <span className="inline-block text-grotesk text-xs tracking-[0.3em] px-3 py-1 bg-[oklch(0.55_0.25_27)] text-white">
                  {product.badge}
                </span>
              )}

              <p className="mt-4 text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">
                {product.category.toUpperCase()}

                {product.tag && ` · ${product.tag}`}
              </p>

              <h1 className="mt-2 text-display text-5xl md:text-6xl leading-[1]">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-1 text-[oklch(0.48_0.22_25)]">
                  {Array.from({
                    length: Math.round(product.rating),
                  }).map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>

                <span className="text-sm text-[oklch(0.45_0.01_20)]">
                  {product.rating} · {product.reviews} reviews
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-display text-3xl">₹{product.price}</span>

                {product.oldPrice && (
                  <span className="text-[oklch(0.45_0.01_20)] line-through">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-6 text-[oklch(0.25_0.01_20)] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* SIZE */}
            <div className="pd-fade mt-8">
              <p className="text-grotesk text-xs tracking-[0.3em] mb-3">
                SIZE —{" "}
                <span className="text-[oklch(0.45_0.01_20)]">{size}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 h-12 px-4 border text-grotesk text-sm tracking-[0.2em] transition ${
                      size === s
                        ? "bg-black text-white border-black"
                        : "border-black/15 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY + CART */}
            <div className="pd-fade mt-8 flex items-stretch gap-3">
              <div className="flex items-center border border-black/15">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-14 w-14 flex items-center justify-center"
                >
                  <FiMinus />
                </button>

                <span className="w-10 text-center text-grotesk text-lg">
                  {qty}
                </span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="h-14 w-14 flex items-center justify-center"
                >
                  <FiPlus />
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => addToCart(product, size, qty)}
                className="flex-1 btn-blood text-grotesk text-sm tracking-[0.3em]"
              >
                ADD TO BAG — ₹{product.price * qty}
              </button>

              {/* WISHLIST */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`h-14 w-14 border border-black/15 flex items-center justify-center transition ${
                  wished ? "text-[oklch(0.48_0.22_25)]" : ""
                }`}
              >
                <FiHeart className={wished ? "fill-current" : ""} />
              </button>
            </div>

            {/* FEATURES */}
            <div className="pd-fade mt-10 grid grid-cols-3 gap-3 text-center">
              {[
                {
                  icon: FiTruck,
                  text: "FREE SHIPPING",
                },
                {
                  icon: FiRotateCcw,
                  text: "30 DAY RETURNS",
                },
                {
                  icon: FiShield,
                  text: "AUTHENTIC",
                },
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="border border-black/10 py-4">
                  <Icon className="mx-auto text-xl text-[oklch(0.48_0.22_25)]" />

                  <p className="mt-2 text-grotesk text-[10px] tracking-[0.25em]">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div className="pd-fade mt-10 border-t border-black/10">
              <div className="flex gap-6 border-b border-black/10">
                {[
                  ["desc", "Description"],
                  ["details", "Details"],
                  ["shipping", "Shipping"],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`py-4 text-grotesk text-xs tracking-[0.3em] border-b-2 transition ${
                      tab === k
                        ? "border-black text-black"
                        : "border-transparent text-[oklch(0.45_0.01_20)]"
                    }`}
                  >
                    {label.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="py-6 text-[oklch(0.25_0.01_20)] leading-relaxed text-sm">
                {tab === "desc" && <p>{product.description}</p>}

                {tab === "details" && (
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Premium Fabric</li>
                    <li>Oversized Fit</li>
                    <li>Streetwear Style</li>
                  </ul>
                )}

                {tab === "shipping" && (
                  <ul className="space-y-2">
                    <li>Ships in 48 hours</li>
                    <li>Free shipping over ₹2500</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-28">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-display text-4xl md:text-5xl">
              You Might Also Like
            </h2>

            <Link
              to="/shop"
              className="text-grotesk text-xs tracking-[0.3em] underline underline-offset-8"
            >
              SHOP ALL →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} p={rp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;