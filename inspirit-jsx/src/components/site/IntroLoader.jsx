import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import logo from '@/assets/inspirit-logo.png';
export default function IntroLoader() {
    const [done, setDone] = useState(false);
    const root = useRef(null);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        if (sessionStorage.getItem('inspirit:loaded')) {
            setDone(true);
            return;
        }
        const tl = gsap.timeline({ onComplete: () => { sessionStorage.setItem('inspirit:loaded', '1'); setDone(true); } });
        tl.from('.intro-logo', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' })
            .to('.intro-bar', { width: '100%', duration: 1.6, ease: 'power2.inOut' }, '<0.2')
            .to('.intro-count', { textContent: 100, duration: 1.6, ease: 'power2.inOut', snap: { textContent: 1 } }, '<')
            .to('.intro-logo', { opacity: 0, y: -30, duration: 0.6, ease: 'power3.in' }, '+=0.2')
            .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<0.1');
    }, []);
    if (done)
        return null;
    return (<div ref={root} className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, oklch(0.10 0.01 22) 0%, oklch(0.05 0.005 20) 80%)' }}>
      <img src={logo} alt="" className="intro-logo h-24 md:h-32 w-auto mix-blend-screen"/>
      <div className="mt-12 w-64 md:w-96 h-px bg-white/10 overflow-hidden">
        <div className="intro-bar h-full w-0 bg-[oklch(0.55_0.25_27)]" style={{ boxShadow: '0 0 20px oklch(0.55 0.25 27)' }}/>
      </div>
      <div className="mt-4 text-grotesk text-white/70 text-sm tracking-[0.4em]">
        <span className="intro-count">0</span>% — ENTERING THE RITUAL
      </div>
    </div>);
}
