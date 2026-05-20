import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function Counter({ to, suffix = '', label }) {
    const n = useRef(null);
    useEffect(() => {
        const obj = { v: 0 };
        const tw = gsap.to(obj, {
            v: to, duration: 2.4, ease: 'power2.out',
            scrollTrigger: { trigger: n.current, start: 'top 85%' },
            onUpdate: () => { if (n.current)
                n.current.textContent = Math.floor(obj.v).toLocaleString(); },
        });
        return () => { tw.kill(); };
    }, [to]);
    return (<div className="text-center">
      <div className="text-display text-5xl md:text-7xl text-white">
        <span ref={n}>0</span><span className="text-[oklch(0.55_0.25_27)]">{suffix}</span>
      </div>
      <div className="mt-2 text-grotesk text-xs md:text-sm tracking-[0.3em] text-white/50">{label}</div>
    </div>);
}
