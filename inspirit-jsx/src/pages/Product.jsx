import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import {
  
  FiMinus,
  FiPlus,
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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const galleryRef = useRef(null);

  useEffect(() => {
    console.log("slug:", slug);
    console.log("product:", product);
  }, [slug, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Product Not Found
      </div>
    );
  }

  useEffect(() => {
    if (product.sizes?.length > 0) {
      setSize(product.sizes[0]);
    }
  }, [product]);

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
        scale: 1.05,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [slug]);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const wished = wishlist.includes(product.id);

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">

        {/* Breadcrumb */}
        <nav className="text-xs tracking-[0.3em] mb-8">
          <Link to="/">HOME</Link> /{" "}
          <Link to="/shop">SHOP</Link> /{" "}
          <span>{product.name.toUpperCase()}</span>
        </nav>

        <div
          ref={galleryRef}
          className="grid lg:grid-cols-12 gap-10"
        >

          {/* LEFT */}
          <div className="lg:col-span-7 grid grid-cols-[80px_minmax(0,1fr)] gap-4 min-w-0">

            {/* THUMBS */}
            <div className="hidden md:block">
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                modules={[FreeMode, Thumbs]}
                freeMode
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={10}
                className="h-[600px] w-full"
              >
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      className="h-[140px] w-full object-cover cursor-pointer"
                      alt=""
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* MAIN IMAGE */}
            <div className="pd-image w-full h-[600px] min-w-0">
              <Swiper
                modules={[Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                className="h-full w-full min-w-0"
                style={{ width: "100%" }}
              >
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">

            <div className="pd-fade">

              {product.badge && (
                <span className="text-xs px-3 py-1 bg-black text-white">
                  {product.badge}
                </span>
              )}

              <p className="mt-4 text-xs tracking-widest">
                {product.category.toUpperCase()}
              </p>

              <h1 className="text-4xl mt-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {Array.from({ length: Math.round(product.rating) }).map(
                    (_, i) => (
                      <FiStar key={i} />
                    )
                  )}
                </div>
                <span className="text-sm">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 text-3xl">
                ₹{product.price}
              </div>

              <p className="mt-5 text-sm opacity-70">
                {product.description}
              </p>
            </div>

            {/* SIZE */}
            <div className="mt-8">
              <p className="text-xs tracking-widest mb-3">
                SIZE: {size}
              </p>

              <div className="flex gap-2 flex-wrap">
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 border ${
                      size === s ? "bg-black text-white" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CART */}
            <div className="flex gap-3 mt-8 items-center">

              <div className="flex border items-center">
                <button
                  className="px-3"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <FiMinus />
                </button>

                <span className="px-4">{qty}</span>

                <button
                  className="px-3"
                  onClick={() => setQty(qty + 1)}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, size, qty)}
                className="bg-black text-white px-6 py-2"
              >
                ADD TO BAG ₹{product.price * qty}
              </button>

           
            </div>

          </div>
        </div>

        {/* RELATED */}
        <div className="mt-28">
          <h2 className="text-3xl mb-10">
            You Might Also Like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductPage;