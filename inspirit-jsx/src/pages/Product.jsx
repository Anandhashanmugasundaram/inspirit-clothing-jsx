import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FiHeart, FiMinus, FiPlus, FiTruck, FiShield, FiRotateCcw, FiStar } from 'react-icons/fi';
import { findProduct, PRODUCTS } from '@/data/products';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/site/ProductCard';
({
    component: ProductPage,
    loader: ({ params }) => {
        const p = findProduct(params.slug);
        if (!p)
            return { product: p };
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [
            { title: `${loaderData.product.name} — INSPIRIT` },
            { name: 'description', content: loaderData.product.description },
            { property: 'og:image', content: loaderData.product.images[0] },
        ] : [],
    }),
});
function ProductPage() {
    const { slug } = useParams();
    const p = findProduct(slug); if (!p) return <div className='min-h-screen flex items-center justify-center'>Not found</div>;
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const [size, setSize] = useState(p.sizes[Math.min(2, p.sizes.length - 1)]);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState('desc');
    const [thumbs, setThumbs] = useState(null);
    const galleryRef = useRef(null);
    const wished = wishlist.includes(p.id);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.pd-fade', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08 });
            gsap.from('.pd-image', { scale: 1.08, opacity: 0, duration: 1.4, ease: 'expo.out' });
        });
        return () => ctx.revert();
    }, [slug]);
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    return (<div className="bone-section pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <nav className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)] mb-8">
          <Link to="/" className="hover:text-black">HOME</Link> / <Link to="/shop" className="hover:text-black">SHOP</Link> / <span className="text-black">{p.name.toUpperCase()}</span>
        </nav>

        <div ref={galleryRef} className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 grid grid-cols-[80px_1fr] gap-3">
            <div className="hidden md:block">
              <Swiper onSwiper={setThumbs} direction="vertical" modules={[FreeMode, Thumbs]} freeMode watchSlidesProgress slidesPerView={4} spaceBetween={10} className="h-[600px]">
                {p.images.map((img, i) => (<SwiperSlide key={i} className="cursor-pointer overflow-hidden">
                    <img src={img} className="h-full w-full object-cover" loading="lazy"/>
                  </SwiperSlide>))}
              </Swiper>
            </div>
            <div className="col-span-2 md:col-span-1 pd-image">
              <Swiper modules={[Thumbs]} thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }} className="aspect-[3/4] w-full">
                {p.images.map((img, i) => (<SwiperSlide key={i}>
                    <div className="group h-full w-full overflow-hidden bg-[oklch(0.94_0.005_60)]">
                      <img src={img} className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-1000" loading="lazy"/>
                    </div>
                  </SwiperSlide>))}
              </Swiper>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <div className="pd-fade">
              {p.badge && <span className="inline-block text-grotesk text-xs tracking-[0.3em] px-3 py-1 bg-[oklch(0.55_0.25_27)] text-white">{p.badge}</span>}
              <p className="mt-4 text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">{p.category.toUpperCase()}{p.tag && ` · ${p.tag}`}</p>
              <h1 className="mt-2 text-display text-5xl md:text-6xl leading-[1]">{p.name}</h1>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-1 text-[oklch(0.48_0.22_25)]">{Array.from({ length: Math.round(p.rating) }).map((_, k) => <FiStar key={k} className="fill-current"/>)}</div>
                <span className="text-sm text-[oklch(0.45_0.01_20)]">{p.rating} · {p.reviews} reviews</span>
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-display text-3xl">${p.price}</span>
                {p.oldPrice && <span className="text-[oklch(0.45_0.01_20)] line-through">${p.oldPrice}</span>}
              </div>
              <p className="mt-6 text-[oklch(0.25_0.01_20)] leading-relaxed">{p.description}</p>
            </div>

            <div className="pd-fade mt-8">
              <p className="text-grotesk text-xs tracking-[0.3em] mb-3">SIZE — <span className="text-[oklch(0.45_0.01_20)]">{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map(s => (<button key={s} onClick={() => setSize(s)} className={`min-w-12 h-12 px-4 border text-grotesk text-sm tracking-[0.2em] transition ${size === s ? 'bg-black text-white border-black' : 'border-black/15 hover:border-black'}`}>{s}</button>))}
              </div>
            </div>

            <div className="pd-fade mt-8 flex items-stretch gap-3">
              <div className="flex items-center border border-black/15">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-14 flex items-center justify-center"><FiMinus /></button>
                <span className="w-10 text-center text-grotesk text-lg">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-14 w-14 flex items-center justify-center"><FiPlus /></button>
              </div>
              <button onClick={() => addToCart(p, size, qty)} className="flex-1 btn-blood text-grotesk text-sm tracking-[0.3em]">ADD TO BAG — ${p.price * qty}</button>
              <button onClick={() => toggleWishlist(p.id)} className={`h-14 w-14 border border-black/15 flex items-center justify-center transition ${wished ? 'text-[oklch(0.48_0.22_25)]' : ''}`}><FiHeart className={wished ? 'fill-current' : ''}/></button>
            </div>

            <div className="pd-fade mt-10 grid grid-cols-3 gap-3 text-center">
              {[{ i: FiTruck, t: 'FREE OVER $250' }, { i: FiRotateCcw, t: '30 DAY RETURNS' }, { i: FiShield, t: 'AUTHENTIC' }].map(({ i: Icon, t }, k) => (<div key={k} className="border border-black/10 py-4">
                  <Icon className="mx-auto text-xl text-[oklch(0.48_0.22_25)]"/>
                  <p className="mt-2 text-grotesk text-[10px] tracking-[0.25em]">{t}</p>
                </div>))}
            </div>

            <div className="pd-fade mt-10 border-t border-black/10">
              <div className="flex gap-6 border-b border-black/10">
                {[['desc', 'Description'], ['details', 'Details'], ['shipping', 'Shipping']].map(([k, l]) => (<button key={k} onClick={() => setTab(k)} className={`py-4 text-grotesk text-xs tracking-[0.3em] border-b-2 transition ${tab === k ? 'border-black text-black' : 'border-transparent text-[oklch(0.45_0.01_20)]'}`}>{l.toUpperCase()}</button>))}
              </div>
              <div className="py-6 text-[oklch(0.25_0.01_20)] leading-relaxed text-sm">
                {tab === 'desc' && <p>{p.description} Hand-finished in our atelier. Each piece undergoes 14-point quality control before leaving the studio.</p>}
                {tab === 'details' && <ul className="space-y-2 list-disc pl-5"><li>280gsm premium fabric</li><li>Drop-shoulder construction</li><li>Embroidered house insignia</li><li>Made in Portugal</li></ul>}
                {tab === 'shipping' && <ul className="space-y-2"><li>Ships within 48 hours</li><li>Free worldwide shipping over $250</li><li>30-day returns on unworn pieces</li></ul>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-display text-4xl md:text-5xl">You might also wear</h2>
            <Link to="/shop" className="text-grotesk text-xs tracking-[0.3em] underline underline-offset-8">SHOP ALL →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {related.map(rp => <ProductCard key={rp.id} p={rp}/>)}
          </div>
        </div>
      </div>
    </div>);
}
export default ProductPage;
