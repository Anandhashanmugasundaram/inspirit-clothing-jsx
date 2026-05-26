import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Counter from '@/components/site/Counter';
import ImageOne from '../assets/Inspirits-img.png'
gsap.registerPlugin(ScrollTrigger);
({ component: About,
    head: () => ({ meta: [{ title: 'Story — INSPIRIT Clothing' }, { name: 'description', content: 'The INSPIRIT manifesto, atelier and the people behind the ritual.' }] }),
});
function About() {
    const root = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.reveal').forEach(el => {
                gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
            });
            gsap.from('.timeline-bar', { scaleY: 0, transformOrigin: 'top', ease: 'none',
                scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 80%', scrub: true } });
        }, root);
        return () => ctx.revert();
    }, []);
    return (<div ref={root} className="bone-section pt-32 md:pt-40">
      <section className="ink-section -mt-32 md:-mt-40 pt-44 md:pt-56 pb-28 relative overflow-hidden">
        <img src= "" className="absolute inset-0 h-full w-full object-cover opacity-60"/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"/>
        <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)]">— THE HOUSE</p>
          <h1 className="mt-4 text-display text-6xl md:text-[9rem] leading-[0.9] text-white">A church<br />of <em className="text-[oklch(0.65_0.25_27)] not-italic">cloth.</em></h1>
          <p className="mt-8 max-w-xl text-white/70 text-lg leading-relaxed">INSPIRIT was founded in 2019 in a one-room atelier in Lisbon. We don't sell trends — we ship rituals. Numbered drops. Heavy fabrics. Unisex by faith.</p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-5 md:px-10 text-center">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.55_0.25_27)] reveal">— MANIFESTO</p>
          <p className="reveal mt-8 text-display text-3xl md:text-5xl leading-tight">"We design garments the way a monk copies scripture. Slowly, repeatedly, with reverence for the weight of a single seam."</p>
          <p className="reveal mt-6 text-grotesk text-xs tracking-[0.3em] text-[oklch(0.45_0.01_20)]">— THE FOUNDERS</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="ink-section py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <p className="text-grotesk text-xs tracking-[0.4em] text-[oklch(0.65_0.25_27)] reveal text-center">— CHAPTERS</p>
          <h2 className="text-center reveal mt-3 text-display text-5xl md:text-6xl text-white">A short history.</h2>

          <div className="timeline mt-16 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10"/>
            <div className="timeline-bar absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[oklch(0.55_0.25_27)]" style={{ boxShadow: '0 0 12px oklch(0.55 0.25 27)' }}/>
            {[
            { y: '2025', t: 'Founded', d: 'Started in Chennai with a vision, launched our Instagram page, and began selling our first collection online.' },
            { y: '2025', t: 'Chapter 01', d: 'Opened our first push cart in Chennai, bringing the brand directly to the streets and community.' },
            { y: '2026', t: 'The Chapter 02', d: 'Preparing to open our first official store in Chennai — a new chapter for the brand and its journey.' },
            // { y: '202', t: 'Chapter 07 — Ashes', d: 'The current rite. Blood-tone palette. Unisex by faith.' },
        ].map((it, i) => (<div key={i} className={`reveal relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-10 mb-14 ${i % 2 ? 'md:text-left' : 'md:text-right'}`}>
                <div className={`absolute left-2.5 md:left-1/2 top-1.5 -ml-1.5 h-3 w-3 rounded-full bg-[oklch(0.55_0.25_27)] animate-pulse-glow`}/>
                <div className={i % 2 ? 'md:col-start-2' : ''}>
                  <p className="text-display text-3xl text-[oklch(0.65_0.25_27)]">{it.y}</p>
                  <h3 className="text-display text-2xl text-white mt-1">{it.t}</h3>
                  <p className="text-white/60 mt-2 max-w-sm md:inline-block">{it.d}</p>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      <section className="ink-section pb-28">
        <div className="mx-auto max-w-375 px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter to={150} label="PIECES DROP"/>
          <Counter to={3} label="CHAPTERS"/>
          <Counter to={1} label="ATELIER HANDS"/>
          <Counter to={1} suffix=" CITY" label="CHENNAI"/>
        </div>
      </section>
<section className="py-24 md:py-32 bg-[#ece7df] overflow-hidden">
  <div className="mx-auto max-w-7xl px-5 md:px-10">

    {/* Heading */}
    <div className="text-center reveal">
      <p className="text-[11px] tracking-[0.45em] uppercase text-[oklch(0.65_0.25_27)]">
        — OUR STREET ROOTS
      </p>

      <h2 className="mt-5 text-display text-5xl md:text-7xl uppercase leading-[0.9] text-[#111]">
        BUILT FROM <br />
        THE STREETS
      </h2>

      <p className="mt-6 max-w-2xl mx-auto text-black/55 leading-relaxed">
        INSPIRIT began with a single push cart, moving through the streets of
        Chennai with oversized silhouettes, heavyweight fabrics, and a vision
        to build culture through clothing.
      </p>
    </div>

    {/* Main Showcase */}
    <div className="reveal mt-16 relative rounded-[36px] overflow-hidden border border-black/5 bg-[#f5efe7] shadow-[0_25px_80px_rgba(0,0,0,0.08)]">

      {/* Soft Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-black/[0.03]" />

      <div className="relative grid lg:grid-cols-2 gap-10 items-center p-8 md:p-14">

        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black text-white text-xs tracking-[0.25em] uppercase">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.25_27)] animate-pulse" />
            Since 2025
          </div>

          <h3 className="mt-8 text-display text-4xl md:text-6xl leading-[0.95] text-[#111] uppercase">
            From Push Cart <br />
            To Culture
          </h3>

          <p className="mt-6 text-black/60 leading-relaxed max-w-lg">
            What started as a moving cart became a statement. Every collection
            carries the energy of Chennai streets — raw, fearless, and
            community-driven.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-5">
            <div className="rounded-3xl bg-white p-6 border border-black/5">
              <h4 className="text-4xl font-black text-[#111]">01</h4>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-black/50">
                Push Cart
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-black/5">
              <h4 className="text-4xl font-black text-[#111]">100+</h4>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-black/50">
                Pieces Sold
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">

          <div className="absolute -top-5 -right-5 h-40 w-40 rounded-full bg-[oklch(0.65_0.25_27/.15)] blur-3xl" />

          <img
            src={ImageOne}
            alt="INSPIRIT Street Cart"
            className="relative z-10 w-full object-contain"
          />

          {/* Floating Card */}
          {/* <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white rounded-3xl px-6 py-5 shadow-2xl border border-black/5 z-20">

            <p className="text-[10px] tracking-[0.35em] uppercase text-[oklch(0.65_0.25_27)]">
              CHAPTER 01
            </p>

            <h4 className="mt-2 text-2xl md:text-4xl font-black uppercase text-[#111] leading-none">
              STREET CART
            </h4> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  </div>
</section>
    </div>);
}
export default About;