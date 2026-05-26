import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Counter from '@/components/site/Counter';
import ImageOne from '../assets/cover_img1.jpg'
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
    return (<div ref={root} className="bone-section pt-32 md:pt-40 pb-24">
      <section className="ink-section -mt-32 md:-mt-40 pt-44 md:pt-56 pb-28 relative overflow-hidden">
        <img src= {ImageOne} className="absolute inset-0 h-full w-full object-cover opacity-60"/>
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
    </div>);
}
export default About;