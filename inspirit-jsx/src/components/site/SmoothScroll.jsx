import { useEffect } from 'react';
import Lenis from 'lenis';
export default function SmoothScroll() {
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        let raf = 0;
        const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf); lenis.destroy(); };
    }, []);
    return null;
}
