import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Counter from '@/components/site/Counter';
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
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=2400&q=80&auto=format" className="absolute inset-0 h-full w-full object-cover opacity-20"/>
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
            { y: '2019', t: 'Founded', d: 'A one-room atelier in Lisbon. Three friends, one sewing machine, one promise.' },
            { y: '2021', t: 'Chapter 01', d: 'Our first numbered jersey. 300 pieces. Sold out in 9 minutes.' },
            { y: '2023', t: 'The Cathedral Cut', d: 'We unveiled the silhouette that defined the house. Architectural, sacred, heavy.' },
            { y: '2026', t: 'Chapter 07 — Ashes', d: 'The current rite. Blood-tone palette. Unisex by faith.' },
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
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter to={300} label="PIECES PER DROP"/>
          <Counter to={7} label="CHAPTERS"/>
          <Counter to={14} label="ATELIER HANDS"/>
          <Counter to={1} suffix=" CITY" label="LISBON"/>
        </div>
      </section>
    </div>);
}
export default About;
