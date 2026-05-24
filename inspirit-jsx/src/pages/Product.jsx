import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";

import { FiMinus, FiPlus, FiStar } from "react-icons/fi";

import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/site/ProductCard";

import toast from "react-hot-toast";

function ProductPage() {
  const { slug } = useParams();

  const { addToCart, wishlist } = useApp();

  const [product, setProduct] = useState(null);

  const [allProducts, setAllProducts] = useState([]);

  const [size, setSize] = useState("");

  const [qty, setQty] = useState(1);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const galleryRef = useRef(null);

  const API =
    import.meta.env.VITE_API_URL ||
    "https://inspirit-clothing-jsx.onrender.com";

  // ======================
  // REFETCH PRODUCT
  // ======================
  const refetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      const found = res.data.find((p) => p._id === slug || p.slug === slug);
      if (found) setProduct(found);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // FETCH PRODUCT
  // ======================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);

        setAllProducts(res.data);

        const found = res.data.find((p) => p._id === slug || p.slug === slug);

        setProduct(found);
      } catch (error) {
        console.log("FETCH ERROR:", error);
      }
    };

    fetchProducts();
  }, [slug]);

  // ======================
  // DEFAULT SIZE
  // ======================
  useEffect(() => {
    if (product?.sizes) {
      const firstSize = Object.keys(product.sizes)[0];
      setSize(firstSize);
    }
  }, [product]);

  // ======================
  // RESET QTY WHEN SIZE CHANGES
  // ======================
  useEffect(() => {
    setQty(1);
  }, [size]);

  // ======================
  // GSAP
  // ======================
  useEffect(() => {
    if (!product) return;

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
  }, [product]);

  // ======================
  // LOADING
  // ======================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Product...
      </div>
    );
  }

  // ======================
  // RELATED PRODUCTS
  // ======================
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const wished = wishlist.includes(product._id);

  // ======================
  // STOCK
  // ======================
  const selectedStock = product.sizes?.[size] || 0;

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {/* BREADCRUMB */}
        <nav className="text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] mb-6 md:mb-8 break-words">
          <Link to="/">HOME</Link>
          {" / "}
          <Link to="/shop">SHOP</Link>
          {" / "}
          <span>{product.name?.toUpperCase()}</span>
        </nav>

        <div ref={galleryRef} className="grid lg:grid-cols-12 gap-8 md:gap-10">
          {/* LEFT */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-[80px_minmax(0,1fr)] gap-4 min-w-0">
            {/* THUMBNAILS */}
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
                      src={img?.url || "/placeholder.png"}
                      className="h-[140px] w-full object-cover cursor-pointer"
                      alt={product.name}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* MAIN IMAGE */}
            <div className="pd-image w-full min-w-0 overflow-hidden aspect-[3/4] sm:aspect-auto sm:h-[80vh] lg:h-[600px] relative rounded-2xl">
              <Swiper
                modules={[Pagination, Thumbs]}
                slidesPerView={1}
                spaceBetween={0}
                grabCursor={true}
                touchRatio={1}
                simulateTouch={true}
                pagination={{ clickable: true }}
                thumbs={{
                  swiper:
                    window.innerWidth >= 768 &&
                    thumbsSwiper &&
                    !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                className="h-full w-full product-swiper"
              >
                {product.images?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-full">
                      <img
                        src={img?.url || "/placeholder.png"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="pd-fade">
              {product.badge && (
                <span className="text-[10px] md:text-xs px-3 py-1 bg-black text-white">
                  {product.badge}
                </span>
              )}

              <p className="mt-4 text-[10px] md:text-xs tracking-[0.2em] md:tracking-widest uppercase opacity-60">
                {product.category}
              </p>

              <h1 className="text-3xl sm:text-4xl mt-2 font-semibold leading-tight break-words">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center flex-wrap gap-2 mt-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} />
                  ))}
                </div>
                <span className="text-sm opacity-70">5.0 (120 Reviews)</span>
              </div>

              {/* PRICE */}
              <div className="mt-5 text-2xl md:text-3xl font-semibold">
                ₹{product.price}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-5 text-sm md:text-[15px] opacity-70 leading-7 break-words">
                {product.description}
              </p>
            </div>

            {/* SIZE */}
            <div className="mt-8">
              <p className="text-xs tracking-widest mb-3">SIZE: {size}</p>

              <div className="flex gap-2 flex-wrap">
                {Object.entries(product.sizes || {}).map(([s, stock]) => {
                  const outOfStock = stock <= 0;

                  return (
                    <button
                      key={s}
                      disabled={outOfStock}
                      onClick={() => setSize(s)}
                      className={`min-w-[52px] px-4 py-2 border text-sm transition ${
                        size === s ? "bg-black text-white" : ""
                      } ${
                        outOfStock
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY + CART */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 items-stretch sm:items-center">
              {/* QTY */}
              <div className="flex border items-center h-[52px] w-full sm:w-fit justify-between sm:justify-normal">
                <button
                  type="button"
                  className="px-4 h-full flex items-center justify-center"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <FiMinus />
                </button>

                <span className="px-5 font-medium">{qty}</span>

                <button
                  type="button"
                  className="px-4 h-full flex items-center justify-center"
                  onClick={() => {
                    if (qty >= selectedStock) {
                      toast.error(`Only ${selectedStock} items available`);
                      return;
                    }
                    setQty(qty + 1);
                  }}
                >
                  <FiPlus />
                </button>
              </div>

              {/* ADD TO BAG */}
              <button
                disabled={selectedStock === 0}
                onClick={async () => {
                  if (qty > selectedStock) {
                    toast.error(`Only ${selectedStock} items available`);
                    return;
                  }

                  await addToCart(product, size, qty);
                  await refetchProduct(); // ✅ refresh stock display
                  setQty(1); // ✅ reset qty
                }}
                className="w-full sm:w-auto bg-black text-white px-6 md:px-8 py-4 text-sm md:text-base hover:opacity-90 transition disabled:opacity-40"
              >
                {selectedStock === 0
                  ? "OUT OF STOCK"
                  : `ADD TO BAG • ₹${product.price * qty}`}
              </button>
            </div>

            {/* STOCK TEXT */}
            <p className="mt-4 text-sm opacity-60">
              {selectedStock > 0
                ? `${selectedStock} items left`
                : "Currently unavailable"}
            </p>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <h2 className="text-2xl md:text-3xl mb-8 md:mb-10">
              You Might Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
