import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function Cursor() {
    const dot = useRef(null);
    const ring = useRef(null);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        if (window.matchMedia('(max-width: 1024px)').matches)
            return;
        const xTo = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'expo.out' });
        const yTo = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'expo.out' });
        const dxTo = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' });
        const dyTo = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' });
        const move = (e) => { xTo(e.clientX); yTo(e.clientY); dxTo(e.clientX); dyTo(e.clientY); };
        const over = (e) => {
            const t = e.target;
            if (t.closest('a, button, [data-cursor]')) {
                gsap.to(ring.current, { scale: 1.8, borderColor: 'oklch(0.55 0.25 27)', duration: 0.3 });
            }
            else {
                gsap.to(ring.current, { scale: 1, borderColor: 'oklch(0.985 0.003 60 / 0.6)', duration: 0.3 });
            }
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseover', over);
        return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
    }, []);
    return (<>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-4 -mt-4 hidden lg:block h-8 w-8 rounded-full border" style={{ borderColor: 'oklch(0.985 0.003 60 / 0.6)', mixBlendMode: 'difference' }}/>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] hidden lg:block h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.25_27)]"/>
    </>);
}
