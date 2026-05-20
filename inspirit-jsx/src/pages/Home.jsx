import { Link } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import Marquee from '@/components/site/Marquee';
import ProductCard from '@/components/site/ProductCard';
import Counter from '@/components/site/Counter';
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from '@/data/products';
gsap.registerPlugin(ScrollTrigger);
({ component: Home });
const HERO_SLIDES = [
    { tag: 'CHAPTER 07 — ASHES', title: 'WEAR THE\nRITUAL', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=85&auto=format' },
    { tag: 'LIMITED — 300 PIECES', title: 'BLOOD\nTONE', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2000&q=85&auto=format' },
    { tag: 'NEW DROP — SS26', title: 'CATHEDRAL\nCUTS', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&q=85&auto=format' },
];
function Home() {
    const heroRef = useRef(null);
    const horizRef = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split hero title
            gsap.utils.toArray('.split-line').forEach((el, i) => {
                gsap.from(el, { y: '110%', duration: 1.2, ease: 'expo.out', delay: 0.2 + i * 0.1 });
            });
            gsap.from('.hero-fade', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.6 });
            // Section reveals
            gsap.utils.toArray('.reveal').forEach((el) => {
                gsap.from(el, {
                    y: 60, opacity: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                });
            });
            // Parallax
            gsap.utils.toArray('[data-parallax]').forEach((el) => {
                gsap.to(el, {
                    yPercent: -15, ease: 'none',
                    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
                });
            });
            // Horizontal scroll showcase
            if (horizRef.current) {
                const track = horizRef.current.querySelector('.h-track');
                if (track) {
                    const dist = track.scrollWidth - window.innerWidth;
                    gsap.to(track, {
                        x: -dist, ease: 'none',
                        scrollTrigger: {
                            trigger: horizRef.current, start: 'top top', end: `+=${dist}`, scrub: 1, pin: true, invalidateOnRefresh: true,
                        },
                    });
                }
            }
        }, heroRef);
        return () => ctx.revert();
    }, []);
    const featured = PRODUCTS.slice(0, 8);
    const limited = PRODUCTS.filter(p => p.badge === 'LIMITED');
    return (<div ref={heroRef}>
      {/* HERO */}
      <section className="relative h-[100svh] w-full overflow-hidden ink-section">
        <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" autoplay={{ delay: 5500 }} loop pagination={{ clickable: true }} className="absolute inset-0 h-full w-full">
          {HERO_SLIDES.map((s, i) => (<SwiperSlide key={i}>
              <div className="absolute inset-0">
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105"/>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, oklch(0.06 0.005 20 / 0.3) 0%, oklch(0.06 0.005 20 / 0.85) 100%)' }}/>
              </div>
            </SwiperSlide>))}
        </Swiper>

        <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-10 h-full flex flex-col justify-end pb-24 md:pb-32">
          <div className="hero-fade flex items-center gap-3 text-grotesk text-xs tracking-[0.4em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.25_27)] animate-pulse-glow"/>
            INSPIRIT — CHAPTER 07 LIVE
          </div>
          <h1 className="mt-6 text-display text-[18vw] md:text-[10vw] leading-[0.85] text-white tracking-[-0.04em]">
            <span className="block overflow-hidden"><span className="split-line block">WEAR THE</span></span>
            <span className="block overflow-hidden"><span className="split-line block text-[oklch(0.65_0.25_27)] italic">RITUAL.</span></span>
          </h1>
          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6 hero-fade">
            <Link to="/shop" className="group btn-blood inline-flex items-center gap-3 px-8 py-4 text-grotesk tracking-[0.3em] hover:[&]:btn-blood-hover">
              ENTER THE DROP <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white text-grotesk tracking-[0.3em] underline underline-offset-8 decoration-1 decoration-[oklch(0.55_0.25_27)]">READ THE MANIFESTO</Link>
          </div>
        </div>

        {/* Side meta */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-3 text-white/40 text-grotesk text-xs tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">
          <span>SS26 / RITUAL</span>
          <span>UNISEX</span>
          <span>SCROLL ↓</span>
        </div>
      </section>

      <Marquee items={['INSPIRIT CLOTHING', 'RITUAL WEAR', 'CHAPTER 07', 'BLOOD TONE', 'UNISEX', 'LIMITED 300']}/>

      {/* CATEGORIES */}
      <section className="bone-section py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal">
            <div>
              <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">— THE CANON</p>
              <h2 className="mt-3 text-display text-5xl md:text-7xl leading-[0.95]">Four pillars.<br /><em className="text-[oklch(0.48_0.22_25)] not-italic">One faith.</em></h2>
            </div>
            <Link to="/shop" className="text-grotesk tracking-[0.3em] underline underline-offset-8 decoration-1 hover:text-[oklch(0.48_0.22_25)]">SHOP ALL →</Link>
          </div>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (<Link key={c.key} to="/shop" search={{ cat: c.key }} className="group relative aspect-[3/4] overflow-hidden bg-black reveal">
                <img src={c.image} alt={c.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-display text-3xl md:text-4xl text-white">{c.label}</h3>
                  <p className="text-grotesk text-xs tracking-[0.3em] text-white/60 mt-1 inline-flex items-center gap-2">EXPLORE <FiArrowRight /></p>
                </div>
              </Link>))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bone-section pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex items-end justify-between mb-10 reveal">
            <h2 className="text-display text-4xl md:text-6xl">Featured Pieces</h2>
            <span className="text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">/ 08 SELECTED</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {featured.map((p) => <div key={p.id} className="reveal"><ProductCard p={p}/></div>)}
          </div>
        </div>
      </section>

      {/* STATS - cinematic dark */}
      <section className="ink-section py-28 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80&auto=format" alt="" data-parallax className="absolute inset-0 h-[120%] w-full object-cover opacity-15"/>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent, oklch(0.05 0.005 20) 80%)' }}/>
        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="text-center reveal">
            <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">— THE NUMBERS</p>
            <h2 className="mt-4 text-display text-5xl md:text-7xl text-white">A movement, not a brand.</h2>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10">
            <Counter to={142} label="DROPS RELEASED"/>
            <Counter to={87000} suffix="+" label="RITUAL WEARERS"/>
            <Counter to={36} label="COUNTRIES"/>
            <Counter to={5} suffix=".0" label="AVG. RATING"/>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SHOWCASE */}
      <section ref={horizRef} className="ink-section h-screen overflow-hidden relative">
        <div className="h-track flex h-full will-change-transform">
          <div className="shrink-0 w-screen flex items-center justify-center px-10">
            <div className="max-w-2xl text-center">
              <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">— THE GALLERY</p>
              <h2 className="mt-4 text-display text-6xl md:text-8xl text-white leading-[0.95]">Scroll the<br /><em className="text-[oklch(0.65_0.25_27)] not-italic">sermon.</em></h2>
              <p className="mt-6 text-white/60 max-w-md mx-auto">Five frames from Chapter 07. Each garment, each silhouette, each shadow.</p>
            </div>
          </div>
          {PRODUCTS.slice(0, 5).map((p, i) => (<div key={p.id} className="shrink-0 w-[70vw] md:w-[45vw] h-full p-8 md:p-14">
              <div className="relative h-full w-full overflow-hidden group">
                <img src={p.images[0]} alt={p.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <p className="text-grotesk text-xs tracking-[0.3em] text-white/60">FRAME {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="text-display text-3xl md:text-4xl mt-2">{p.name}</h3>
                  <p className="text-grotesk text-sm mt-1">${p.price}</p>
                </div>
              </div>
            </div>))}
        </div>
      </section>

      <Marquee items={['LIMITED — 300 PIECES', 'FREE WORLDWIDE OVER $250', 'SHIPS IN 48H', 'CHAPTER 07']} variant="red"/>

      {/* LIMITED EDITION */}
      <section className="bone-section py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">— LIMITED EDITION</p>
              <h2 className="mt-3 text-display text-5xl md:text-7xl leading-[0.95]">Numbered.<br />Signed.<br /><em className="text-[oklch(0.48_0.22_25)] not-italic">Yours.</em></h2>
              <p className="mt-6 text-[oklch(0.35_0.01_20)] max-w-md">Each piece in our limited capsule is numbered 1 of 300, foil-stamped and shipped in a hand-sealed obsidian envelope.</p>
              <Link to="/offers" className="mt-8 inline-flex items-center gap-3 btn-blood px-7 py-3 text-grotesk tracking-[0.3em]">SEE THE CAPSULE <FiArrowRight /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {limited.concat(PRODUCTS.slice(5, 7)).slice(0, 4).map((p, i) => (<div key={p.id + i} className={`reveal ${i % 2 ? 'mt-12' : ''}`}><ProductCard p={p}/></div>))}
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO / IMMERSIVE */}
      <section className="relative h-[70vh] md:h-[90vh] overflow-hidden ink-section">
        <img data-parallax src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2400&q=85&auto=format" alt="" className="absolute inset-0 h-[120%] w-full object-cover"/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, oklch(0.05 0.005 20 / 0.6), oklch(0.05 0.005 20 / 0.9))' }}/>
        <div className="relative h-full mx-auto max-w-[1500px] px-5 md:px-10 flex flex-col justify-center items-center text-center">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)] reveal">— THE FILM</p>
          <h2 className="mt-4 text-display text-5xl md:text-8xl text-white leading-[0.9] reveal">A film about<br /><em className="text-[oklch(0.65_0.25_27)] not-italic">becoming.</em></h2>
          <button className="mt-10 group h-24 w-24 md:h-32 md:w-32 rounded-full glass flex items-center justify-center reveal hover:scale-110 transition-transform duration-500">
            <span className="text-display text-3xl text-white pl-1">▶</span>
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bone-section py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="text-center reveal">
            <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)]">— THE WEARERS</p>
            <h2 className="mt-3 text-display text-5xl md:text-7xl">Worn by the world.</h2>
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (<div key={i} className="reveal glass-light p-7 rounded-sm">
                <div className="flex gap-1 text-[oklch(0.48_0.22_25)]">{Array.from({ length: t.rating }).map((_, k) => <FiStar key={k} className="fill-current"/>)}</div>
                <p className="mt-4 text-[oklch(0.18_0.01_20)] leading-relaxed">"{t.text}"</p>
                <div className="mt-6 text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">{t.name} — {t.city}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="bone-section pb-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="flex justify-between items-end mb-10 reveal">
            <h2 className="text-display text-4xl md:text-6xl">@inspirit.clothing</h2>
            <a href="#" className="text-grotesk text-xs tracking-[0.3em] underline underline-offset-8">FOLLOW ↗</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRODUCTS.slice(0, 6).map((p) => (<a key={p.id} href="#" className="aspect-square overflow-hidden group reveal">
                <img src={p.images[0]} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"/>
              </a>))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="ink-section py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ background: 'radial-gradient(circle at 50% 50%, oklch(0.55 0.25 27 / 0.3), transparent 60%)' }}/>
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)] reveal">— THE LIST</p>
          <h2 className="mt-4 text-display text-5xl md:text-6xl text-white leading-[1] reveal">Join the ritual.</h2>
          <p className="mt-4 text-white/60 reveal">Be first to receive drops, capsule news and private invites.</p>
          <form onSubmit={(e) => { e.preventDefault(); import('react-hot-toast').then(m => m.default.success('Welcome to the list')); }} className="reveal mt-8 glass p-2 rounded-full flex items-center max-w-lg mx-auto">
            <input required type="email" placeholder="your@email.com" className="flex-1 bg-transparent text-white placeholder:text-white/40 px-5 py-3 outline-none"/>
            <button className="btn-blood rounded-full px-6 py-3 text-grotesk text-sm tracking-[0.3em]">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </div>);
}
export default Home;
